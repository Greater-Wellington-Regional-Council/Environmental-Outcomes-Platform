package nz.govt.eop.hilltop_crawler.fetcher

import com.fasterxml.jackson.core.JsonParseException
import com.fasterxml.jackson.databind.JsonMappingException
import java.time.Duration
import java.time.Instant
import java.time.temporal.ChronoUnit.DAYS
import java.time.temporal.ChronoUnit.MINUTES
import kotlin.random.Random
import mu.KotlinLogging
import nz.govt.eop.hilltop_crawler.api.parsers.HilltopXmlParsers
import nz.govt.eop.hilltop_crawler.api.requests.HilltopFetcher
import nz.govt.eop.hilltop_crawler.db.DB
import nz.govt.eop.hilltop_crawler.db.DB.HilltopFetchResult
import nz.govt.eop.hilltop_crawler.db.DB.HilltopFetchStatus.*
import nz.govt.eop.hilltop_crawler.fetcher.HilltopMessageType.*
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

/**
 * FetchTaskProcessor is a class responsible for processing fetch tasks from a database.
 *
 * It follows this pattern:
 * - Pick up the next task to process
 * - Fetch the content from the hilltop server source
 * - Compare the content to the previous content
 * - If the content has changed, from the parsed content, create any new tasks based on the content
 * - If the content has changed, send a message to Kafka
 * - Reschedule the task in the DB to run again in the future
 *
 * If any errors occur while processing, the task should be rescheduled to run again in the future
 */
@Component
class FetchTaskProcessor(
    private val db: DB,
    private val fetcher: HilltopFetcher,
    private val parsers: HilltopXmlParsers,
    private val kafkaClient: HilltopMessageClient
) {
  private final val logger = KotlinLogging.logger {}

  @Transactional
  fun runNextTask(): Boolean =
      db.getNextTaskToProcess()?.let {
        runTask(it)
        true
      }
          ?: false

  fun runTask(taskToProcess: DB.HilltopFetchTaskRow) {
    val source = db.getSource(taskToProcess.sourceId)
    val xmlContent = fetcher.fetch(taskToProcess.fetchUri)
    val fetchedAt = Instant.now()

    if (xmlContent == null) {
      db.requeueTask(
          taskToProcess.id,
          taskToProcess.previousDataHash,
          HilltopFetchResult(fetchedAt, FETCH_ERROR, null),
          randomTimeBetween(fetchedAt.plus(5, MINUTES), fetchedAt.plus(60, MINUTES)))
      return
    }

    val isErrorXml =
        try {
          parsers.isHilltopErrorXml(xmlContent)
        } catch (e: JsonParseException) {
          logger.warn(e) { "Failed to parse content [$xmlContent]" }
          true
        }
    if (isErrorXml) {
      db.requeueTask(
          taskToProcess.id,
          taskToProcess.previousDataHash,
          HilltopFetchResult(fetchedAt, HILLTOP_ERROR, null),
          randomTimeBetween(fetchedAt.plus(1, DAYS), fetchedAt.plus(30, DAYS)))
      return
    }

    val taskMapper =
        try {
          when (taskToProcess.requestType) {
            SITES_LIST ->
                SitesListTaskMapper(
                    source,
                    taskToProcess.fetchUri,
                    fetchedAt,
                    xmlContent,
                    parsers.parseSitesResponse(xmlContent))
            MEASUREMENTS_LIST ->
                MeasurementsListTaskMapper(
                    source,
                    taskToProcess.fetchUri,
                    fetchedAt,
                    xmlContent,
                    parsers.parseMeasurementsResponse(xmlContent))
            MEASUREMENT_DATA ->
                MeasurementDataTaskMapper(
                    source,
                    taskToProcess.fetchUri,
                    fetchedAt,
                    xmlContent,
                    parsers.parseMeasurementValuesResponse(xmlContent))
          }
        } catch (e: JsonMappingException) {
          logger.warn(e) { "Failed to parse content [${xmlContent}]" }
          db.requeueTask(
              taskToProcess.id,
              taskToProcess.previousDataHash,
              HilltopFetchResult(fetchedAt, PARSE_ERROR, null),
              randomTimeBetween(fetchedAt.plus(1, DAYS), fetchedAt.plus(30, DAYS)))
          return
        }

    if (taskMapper.contentHash != taskToProcess.previousDataHash) {
      taskMapper.buildNewTasksList().forEach(db::createFetchTask)
      taskMapper.buildKafkaMessage()?.let(kafkaClient::send)
    }

    db.requeueTask(
        taskToProcess.id,
        taskMapper.contentHash,
        HilltopFetchResult(
            fetchedAt,
            if (taskMapper.contentHash == taskToProcess.previousDataHash) UNCHANGED else SUCCESS,
            taskMapper.contentHash),
        taskMapper.determineNextFetchAt())
  }
}

private fun randomTimeBetween(earliest: Instant, latest: Instant): Instant =
    earliest.plusMillis(Random.nextLong(Duration.between(earliest, latest).toMillis() + 1))
