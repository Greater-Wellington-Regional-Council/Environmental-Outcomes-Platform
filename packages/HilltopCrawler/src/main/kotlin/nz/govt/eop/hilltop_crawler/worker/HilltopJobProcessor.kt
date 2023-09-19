package nz.govt.eop.hilltop_crawler.worker

import java.net.URI
import java.security.MessageDigest
import java.time.*
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit.*
import java.time.temporal.Temporal
import kotlin.random.Random
import mu.KotlinLogging
import nz.govt.eop.hilltop_crawler.api.parsers.HilltopXmlParsers
import nz.govt.eop.hilltop_crawler.api.requests.HilltopFetcher
import nz.govt.eop.hilltop_crawler.api.requests.buildMeasurementListUrl
import nz.govt.eop.hilltop_crawler.api.requests.buildPastMeasurementsUrl
import nz.govt.eop.hilltop_crawler.db.DB
import nz.govt.eop.hilltop_crawler.db.DB.HilltopFetchResult
import nz.govt.eop.hilltop_crawler.db.DB.HilltopFetchStatus.*
import nz.govt.eop.hilltop_crawler.worker.HilltopMessageType.*
import org.apache.kafka.clients.admin.NewTopic
import org.apache.kafka.clients.producer.ProducerRecord
import org.apache.kafka.clients.producer.internals.BuiltInPartitioner
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component("HilltopCrawlerTaskScheduler")
class HilltopJobProcessor(
    private val db: DB,
    @Qualifier("hilltopRawDataTopic") private val dataTopic: NewTopic,
    private val fetcher: HilltopFetcher,
    private val parsers: HilltopXmlParsers,
    private val kafkaSender: KafkaTemplate<HilltopMessageKey, HilltopMessage>
) {

  private val logger = KotlinLogging.logger {}

  data class ProcessTaskResult(
      val fetchTasks: List<DB.HilltopFetchTaskCreate>,
      val kafkaMessage: ProducerRecord<HilltopMessageKey, HilltopMessage>?
  )

  @Transactional
  fun runNextQueuedTask(): Boolean {
    val taskToProcess = db.getNextTaskToProcess() ?: return false

    val xmlContent = fetcher.fetch(taskToProcess.fetchUri)
    val fetchTime = Instant.now()
    val nextQueueTime = determineNextFetchAt(fetchTime, taskToProcess.requestType, xmlContent)

    val contentHash = hashMessage(xmlContent)
    if (contentHash == taskToProcess.previousDataHash) {
      logger.info { "Content hash matches for ${taskToProcess.fetchUri}" }
      db.requeueTask(
          taskToProcess.id,
          contentHash,
          HilltopFetchResult(fetchTime, UNCHANGED, contentHash),
          nextQueueTime)
      return true
    }

    val isErrorXml = parsers.isHilltopErrorXml(xmlContent)
    if (isErrorXml) {
      logger.info { "Error XML from Hilltop for $taskToProcess.url" }
      db.requeueTask(
          taskToProcess.id,
          contentHash,
          HilltopFetchResult(fetchTime, HILLTOP_ERROR, contentHash),
          nextQueueTime)
      return true
    }

    val result =
        processTask(taskToProcess, db.getSource(taskToProcess.sourceId), fetchTime, xmlContent)
    result.fetchTasks.forEach(db::createFetchTask)
    if (result.kafkaMessage != null) {
      kafkaSender.send(result.kafkaMessage)
    }

    db.requeueTask(
        taskToProcess.id,
        contentHash,
        HilltopFetchResult(fetchTime, SUCCESS, contentHash),
        nextQueueTime)
    return true
  }

  private fun processTask(
      taskToProcess: DB.HilltopFetchTaskRow,
      source: DB.HilltopSourcesRow,
      fetchTime: Instant,
      xmlContent: String
  ): ProcessTaskResult {
    logger.info { "Processing task ${taskToProcess.id}" }
    val hilltopBaseUrl = getUriWithoutQuery(taskToProcess.fetchUri)
    return when (taskToProcess.requestType) {
      SITES_LIST ->
          processSitesListMessage(xmlContent, fetchTime, taskToProcess, source, hilltopBaseUrl)
      MEASUREMENTS_LIST ->
          processMeasurementsListMessage(
              xmlContent, fetchTime, taskToProcess, source, hilltopBaseUrl)
      MEASUREMENT_DATA ->
          processMeasurementsMessage(xmlContent, fetchTime, taskToProcess, source, hilltopBaseUrl)
    }
  }

  fun processSitesListMessage(
      xmlContent: String,
      fetchTime: Instant,
      taskToProcess: DB.HilltopFetchTaskRow,
      source: DB.HilltopSourcesRow,
      hilltopBaseUrl: String
  ): ProcessTaskResult {
    val sitesXml = parsers.parseSitesResponse(xmlContent)
    val newFetchTasks =
        sitesXml.sites.map {
          DB.HilltopFetchTaskCreate(
              source.id,
              MEASUREMENTS_LIST,
              buildMeasurementListUrl(hilltopBaseUrl, it.name),
          )
        }
    val kafkaMessage =
        HilltopSitesMessage(
            source.councilId,
            hilltopBaseUrl,
            fetchTime,
            taskToProcess.fetchUri.toASCIIString(),
            xmlContent,
        )

    return ProcessTaskResult(
        newFetchTasks,
        ProducerRecord(
            dataTopic.name(),
            BuiltInPartitioner.partitionForKey(
                "${source.councilId}#$hilltopBaseUrl".toByteArray(), dataTopic.numPartitions()),
            kafkaMessage.toKey(),
            kafkaMessage))
  }
  fun processMeasurementsListMessage(
      xmlContent: String,
      fetchTime: Instant,
      taskToProcess: DB.HilltopFetchTaskRow,
      source: DB.HilltopSourcesRow,
      hilltopBaseUrl: String
  ): ProcessTaskResult {
    val parsed = parsers.parseMeasurementsResponse(xmlContent)
    val newFetchTasks =
        parsed.datasources
            .filter { source.config.measurementNames.contains(it.name) }
            .filter { it.type == "StdSeries" }
            .filter { it.measurements.isNotEmpty() }
            .flatMap {
              val fromDate =
                  LocalDate.parse(
                      it.from.subSequence(0, 10), DateTimeFormatter.ofPattern("yyyy-MM-dd"))
              val toDate =
                  LocalDate.parse(
                      it.to.subSequence(0, 10), DateTimeFormatter.ofPattern("yyyy-MM-dd"))

              generateMonthSequence(fromDate, toDate).map { yearMonth ->
                DB.HilltopFetchTaskCreate(
                    source.id,
                    MEASUREMENT_DATA,
                    buildPastMeasurementsUrl(hilltopBaseUrl, it.siteName, it.name, yearMonth),
                )
              }
            }

    val kafkaMessage =
        HilltopMeasurementListMessage(
            source.councilId,
            hilltopBaseUrl,
            fetchTime,
            parsed.datasources.first().siteName,
            taskToProcess.fetchUri.toASCIIString(),
            xmlContent,
        )
    return ProcessTaskResult(
        newFetchTasks,
        ProducerRecord(
            dataTopic.name(),
            BuiltInPartitioner.partitionForKey(
                "${source.councilId}#$hilltopBaseUrl".toByteArray(), dataTopic.numPartitions()),
            kafkaMessage.toKey(),
            kafkaMessage))
  }

  fun processMeasurementsMessage(
      xmlContent: String,
      fetchTime: Instant,
      taskToProcess: DB.HilltopFetchTaskRow,
      source: DB.HilltopSourcesRow,
      hilltopBaseUrl: String
  ): ProcessTaskResult {
    val parsed = parsers.parseMeasurementValuesResponse(xmlContent)
    if (parsed.measurement != null) {
      val kafkaMessage =
          HilltopMeasurementsMessage(
              source.councilId,
              hilltopBaseUrl,
              fetchTime,
              parsed.measurement.siteName,
              parsed.measurement.dataSource.measurementName,
              parsed.measurement.data.values.first().timestamp.let { YearMonth.from(it) },
              taskToProcess.fetchUri.toASCIIString(),
              xmlContent,
          )
      return ProcessTaskResult(
          emptyList(),
          ProducerRecord(
              dataTopic.name(),
              BuiltInPartitioner.partitionForKey(
                  "${source.councilId}#$hilltopBaseUrl".toByteArray(), dataTopic.numPartitions()),
              kafkaMessage.toKey(),
              kafkaMessage))
    } else {
      return ProcessTaskResult(emptyList(), null)
    }
  }
}

private fun determineNextFetchAt(
    fetchTime: Instant,
    requestType: HilltopMessageType,
    xmlContent: String
) =
    when (requestType) {
      SITES_LIST -> {
        randomTimeBetween(fetchTime.plus(7, DAYS), fetchTime.plus(30, DAYS))
      }
      MEASUREMENTS_LIST -> {
        randomTimeBetween(fetchTime.plus(7, DAYS), fetchTime.plus(30, DAYS))
      }
      MEASUREMENT_DATA -> {
        val parsed = HilltopXmlParsers().parseMeasurementValuesResponse(xmlContent)
        val lastValueDate = parsed.measurement?.data?.values?.lastOrNull()?.timestamp
        val now = OffsetDateTime.now()
        if (lastValueDate != null && lastValueDate > now.minus(30, MINUTES)) {
          randomTimeBetween(fetchTime.plus(5, MINUTES), fetchTime.plus(30, MINUTES))
        } else if (lastValueDate != null && lastValueDate > now.minus(1, HOURS)) {
          randomTimeBetween(fetchTime.plus(5, MINUTES), fetchTime.plus(1, HOURS))
        } else if (lastValueDate != null && lastValueDate > now.minus(1, DAYS)) {
          randomTimeBetween(fetchTime.plus(1, HOURS), fetchTime.plus(1, DAYS))
        } else if (lastValueDate != null && lastValueDate > now.minus(7, DAYS)) {
          randomTimeBetween(fetchTime.plus(1, DAYS), fetchTime.plus(7, DAYS))
        } else {
          randomTimeBetween(fetchTime.plus(7, DAYS), fetchTime.plus(30, DAYS))
        }
      }
    }

private fun randomTimeBetween(earliest: Instant, latest: Instant): Instant =
    earliest.plusMillis(Random.nextLong(Duration.between(earliest, latest).toMillis() + 1))

private fun getUriWithoutQuery(original: URI): String {
  return URI(original.scheme, original.authority, original.path, null, null).toASCIIString()
}

/** Generates a sequence of `YearMonth` from `startDate` to `endDate` inclusively. */
private fun <T : Temporal> generateMonthSequence(startDate: T, endDate: T): List<YearMonth> {
  val firstElement = YearMonth.from(startDate)
  val lastElement = YearMonth.from(endDate)
  return generateSequence(firstElement) { it.plusMonths(1) }
      .takeWhile { it <= lastElement }
      .toList()
}

private fun hashMessage(message: String) =
    MessageDigest.getInstance("SHA-256").digest(message.toByteArray()).joinToString("") {
      "%02x".format(it)
    }
