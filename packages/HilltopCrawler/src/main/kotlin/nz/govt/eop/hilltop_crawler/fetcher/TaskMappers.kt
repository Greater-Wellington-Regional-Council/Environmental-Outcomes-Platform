package nz.govt.eop.hilltop_crawler.fetcher

import java.net.URI
import java.security.MessageDigest
import java.time.*
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import java.time.temporal.Temporal
import kotlin.random.Random
import nz.govt.eop.hilltop_crawler.api.parsers.HilltopMeasurementValues
import nz.govt.eop.hilltop_crawler.api.parsers.HilltopMeasurements
import nz.govt.eop.hilltop_crawler.api.parsers.HilltopSites
import nz.govt.eop.hilltop_crawler.api.requests.buildLatestMeasurementsUrl
import nz.govt.eop.hilltop_crawler.api.requests.buildMeasurementListUrl
import nz.govt.eop.hilltop_crawler.api.requests.buildPastMeasurementsUrl
import nz.govt.eop.hilltop_crawler.db.DB
import nz.govt.eop.hilltop_crawler.db.HilltopFetchTaskType

/**
 * This is an abstract class that represents a mapper for processing a specific type of task. When
 * processing a task we do 3 things:
 * * Generate a set of new tasks
 * * Optionally send a message to Kafka
 * * come up with a time to run the task again
 *
 * The differences between these are based on the type of task we are processing. Implementations of
 * this class will be specific to the type of task and are responsible for implementing the logic to
 * do the above per task type.
 */
abstract class TaskMapper<T>(
    val type: HilltopFetchTaskType,
    val sourceConfig: DB.HilltopSourcesRow,
    val fetchedUri: URI,
    val fetchedAt: Instant,
    val content: String,
    val parsedContent: T
) {
  val contentHash: String = hashMessage(content)
  val baseUri = getUriWithoutQuery(fetchedUri)

  abstract fun buildNewTasksList(): List<DB.HilltopFetchTaskCreate>

  abstract fun buildKafkaMessage(): HilltopMessage?

  abstract fun determineNextFetchAt(): Instant

  private fun getUriWithoutQuery(original: URI): String =
      URI(original.scheme, original.authority, original.path, null, null).toASCIIString()

  private fun hashMessage(message: String) =
      MessageDigest.getInstance("SHA-256").digest(message.toByteArray()).joinToString("") {
        "%02x".format(it)
      }

  protected fun randomTimeBetween(earliest: Instant, latest: Instant): Instant =
      earliest.plusMillis(Random.nextLong(Duration.between(earliest, latest).toMillis() + 1))
}

class SitesListTaskMapper(
    sourceConfig: DB.HilltopSourcesRow,
    fetchedUri: URI,
    fetchedAt: Instant,
    content: String,
    parsedContent: HilltopSites
) :
    TaskMapper<HilltopSites>(
        HilltopFetchTaskType.SITES_LIST,
        sourceConfig,
        fetchedUri,
        fetchedAt,
        content,
        parsedContent) {

  override fun buildNewTasksList(): List<DB.HilltopFetchTaskCreate> =
      parsedContent.sites
          .filter { it.name !in sourceConfig.config.excludedSitesNames }
          .map {
            DB.HilltopFetchTaskCreate(
                sourceConfig.id,
                HilltopFetchTaskType.MEASUREMENTS_LIST,
                buildMeasurementListUrl(baseUri, it.name),
            )
          }

  override fun buildKafkaMessage(): HilltopMessage =
      HilltopSitesMessage(
          sourceConfig.councilId,
          baseUri,
          fetchedAt,
          fetchedUri.toASCIIString(),
          content,
      )

  override fun determineNextFetchAt(): Instant =
      randomTimeBetween(fetchedAt.plus(20, ChronoUnit.DAYS), fetchedAt.plus(30, ChronoUnit.DAYS))
}

class MeasurementsListTaskMapper(
    sourceConfig: DB.HilltopSourcesRow,
    fetchedUri: URI,
    fetchedAt: Instant,
    content: String,
    parsedContent: HilltopMeasurements
) :
    TaskMapper<HilltopMeasurements>(
        HilltopFetchTaskType.MEASUREMENTS_LIST,
        sourceConfig,
        fetchedUri,
        fetchedAt,
        content,
        parsedContent) {

  /** Generates a sequence of `YearMonth` from `startDate` to `endDate` inclusively. */
  private fun <T : Temporal> generateMonthSequence(startDate: T, endDate: T): List<YearMonth> {
    val firstElement = YearMonth.from(startDate)
    val lastElement = YearMonth.from(endDate)
    return generateSequence(firstElement) { it.plusMonths(1) }
        .takeWhile { it <= lastElement }
        .toList()
  }

  override fun buildNewTasksList(): List<DB.HilltopFetchTaskCreate> =
      parsedContent.datasources
          .filter { sourceConfig.config.measurementNames.contains(it.name) }
          .filter { it.type == "StdSeries" }
          .filter { it.measurements.isNotEmpty() }
          .filter {
            it.measurements.firstOrNull {
              sourceConfig.config.measurementNames.contains(it.name) && it.vm == null
            } != null
          }
          .flatMap { it ->
            val fromDate =
                LocalDate.parse(
                    it.from.subSequence(0, 10), DateTimeFormatter.ofPattern("yyyy-MM-dd"))
            val toDate =
                LocalDate.parse(it.to.subSequence(0, 10), DateTimeFormatter.ofPattern("yyyy-MM-dd"))

            val requestAs =
                it.measurements
                    .first {
                      sourceConfig.config.measurementNames.contains(it.name) && it.vm == null
                    }
                    .requestAs

            val isLastObservationInCurrentMonth =
                YearMonth.from(toDate) == YearMonth.from(LocalDate.now())

            generateMonthSequence(
                    fromDate,
                    if (isLastObservationInCurrentMonth) toDate.minusMonths(1) else toDate)
                .map { yearMonth ->
                  DB.HilltopFetchTaskCreate(
                      sourceConfig.id,
                      HilltopFetchTaskType.MEASUREMENT_DATA,
                      buildPastMeasurementsUrl(baseUri, it.siteName, requestAs, yearMonth))
                }
                .let { tasks ->
                  if (isLastObservationInCurrentMonth) {
                    tasks.plus(
                        DB.HilltopFetchTaskCreate(
                            sourceConfig.id,
                            HilltopFetchTaskType.MEASUREMENT_DATA_LATEST,
                            buildLatestMeasurementsUrl(baseUri, it.siteName, requestAs)))
                  } else {
                    tasks
                  }
                }
          }

  override fun buildKafkaMessage(): HilltopMessage =
      HilltopMeasurementListMessage(
          sourceConfig.councilId,
          baseUri,
          fetchedAt,
          parsedContent.datasources.first().siteName,
          fetchedUri.toASCIIString(),
          content,
      )

  override fun determineNextFetchAt(): Instant =
      randomTimeBetween(fetchedAt.plus(10, ChronoUnit.DAYS), fetchedAt.plus(20, ChronoUnit.DAYS))
}

class MeasurementDataTaskMapper(
    sourceConfig: DB.HilltopSourcesRow,
    fetchedUri: URI,
    fetchedAt: Instant,
    content: String,
    parsedContent: HilltopMeasurementValues
) :
    TaskMapper<HilltopMeasurementValues>(
        HilltopFetchTaskType.MEASUREMENT_DATA,
        sourceConfig,
        fetchedUri,
        fetchedAt,
        content,
        parsedContent) {
  override fun buildNewTasksList(): List<DB.HilltopFetchTaskCreate> = emptyList()

  override fun buildKafkaMessage(): HilltopMessage? =
      if (parsedContent.measurement != null) {
        HilltopMeasurementsMessage(
            sourceConfig.councilId,
            baseUri,
            fetchedAt,
            parsedContent.measurement.siteName,
            parsedContent.measurement.dataSource.measurementName,
            parsedContent.measurement.data.values.first().timestamp.let { YearMonth.from(it) },
            fetchedUri.toASCIIString(),
            content,
        )
      } else {
        null
      }

  override fun determineNextFetchAt(): Instant =
      randomTimeBetween(fetchedAt.plus(20, ChronoUnit.DAYS), fetchedAt.plus(30, ChronoUnit.DAYS))
}

class MeasurementDataLatestTaskMapper(
    sourceConfig: DB.HilltopSourcesRow,
    fetchedUri: URI,
    fetchedAt: Instant,
    content: String,
    parsedContent: HilltopMeasurementValues
) :
    TaskMapper<HilltopMeasurementValues>(
        HilltopFetchTaskType.MEASUREMENT_DATA_LATEST,
        sourceConfig,
        fetchedUri,
        fetchedAt,
        content,
        parsedContent) {
  override fun buildNewTasksList(): List<DB.HilltopFetchTaskCreate> = emptyList()

  override fun buildKafkaMessage(): HilltopMessage? =
      if (parsedContent.measurement != null) {
        HilltopMeasurementsMessage(
            sourceConfig.councilId,
            baseUri,
            fetchedAt,
            parsedContent.measurement.siteName,
            parsedContent.measurement.dataSource.measurementName,
            parsedContent.measurement.data.values.first().timestamp.let { YearMonth.from(it) },
            fetchedUri.toASCIIString(),
            content,
        )
      } else {
        null
      }

  /**
   * When deciding when next to fetch data, we want to try to guess when data might arrive and fetch
   * as close as possible after that.
   *
   * Because Hilltop doesn't tell us when data arrived, we have to guess based on the last timestamp
   * in the data.
   *
   * Its trying to balance refreshing fast enough to get new data in quickly, while not hammering
   * the server, or wasting time refreshing data that we don't expect to be updated (since this will
   * be called when getting historical data as well)
   */
  override fun determineNextFetchAt(): Instant {

    val lastValueAt = parsedContent.measurement?.data?.values?.lastOrNull()?.timestamp?.toInstant()

    return if (lastValueAt != null && lastValueAt > fetchedAt.minus(1, ChronoUnit.HOURS)) {
      randomTimeBetween(
          maxOf(lastValueAt.plus(15, ChronoUnit.MINUTES), fetchedAt),
          fetchedAt.plus(15, ChronoUnit.MINUTES))
    } else if (lastValueAt != null && lastValueAt > fetchedAt.minus(1, ChronoUnit.DAYS)) {
      randomTimeBetween(fetchedAt, fetchedAt.plus(1, ChronoUnit.HOURS))
    } else if (lastValueAt != null && lastValueAt > fetchedAt.minus(7, ChronoUnit.DAYS)) {
      randomTimeBetween(fetchedAt, fetchedAt.plus(1, ChronoUnit.DAYS))
    } else { // Any older or historical data, will rarely change, so we can fetch it less often.
      randomTimeBetween(fetchedAt, fetchedAt.plus(30, ChronoUnit.DAYS))
    }
  }
}
