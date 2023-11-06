package nz.govt.eop.hilltop_crawler.fetcher

import com.fasterxml.jackson.core.JsonParseException
import com.fasterxml.jackson.databind.JsonMappingException
import java.time.Duration
import java.time.Instant
import java.time.temporal.TemporalAmount
import kotlin.random.Random
import mu.KotlinLogging
import nz.govt.eop.hilltop_crawler.api.HilltopFetcher
import nz.govt.eop.hilltop_crawler.api.parsers.HilltopXmlParsers
import nz.govt.eop.hilltop_crawler.db.DB
import nz.govt.eop.hilltop_crawler.db.DB.HilltopFetchResult
import nz.govt.eop.hilltop_crawler.db.DB.HilltopFetchStatus.*
import nz.govt.eop.hilltop_crawler.db.HilltopFetchTaskType
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
    val fetchedAt = Instant.now()
    try {
      val source = db.getSource(taskToProcess.sourceId)
      val xmlContent = fetcher.fetch(taskToProcess.fetchUri)

      if (xmlContent == null) {
        handleTaskErrorRequeue(
            taskToProcess, fetchedAt, FETCH_ERROR, Duration.ofMinutes(5), Duration.ofHours(1))
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
        handleTaskErrorRequeue(
            taskToProcess, fetchedAt, HILLTOP_ERROR, Duration.ofDays(1), Duration.ofDays(30))
        return
      }

      val taskMapper =
          try {
            when (taskToProcess.requestType) {
              HilltopFetchTaskType.SITES_LIST ->
                  SitesListTaskMapper(
                      source,
                      taskToProcess.fetchUri,
                      fetchedAt,
                      xmlContent,
                      parsers.parseSitesResponse(xmlContent))
              HilltopFetchTaskType.MEASUREMENTS_LIST ->
                  MeasurementsListTaskMapper(
                      source,
                      taskToProcess.fetchUri,
                      fetchedAt,
                      xmlContent,
                      parsers.parseMeasurementsResponse(xmlContent))
              HilltopFetchTaskType.MEASUREMENT_DATA ->
                  MeasurementDataTaskMapper(
                      source,
                      taskToProcess.fetchUri,
                      fetchedAt,
                      xmlContent,
                      parsers.parseMeasurementValuesResponse(xmlContent))
              HilltopFetchTaskType.MEASUREMENT_DATA_LATEST ->
                  MeasurementDataLatestTaskMapper(
                      source,
                      taskToProcess.fetchUri,
                      fetchedAt,
                      xmlContent,
                      parsers.parseMeasurementValuesResponse(xmlContent))
            }
          } catch (e: JsonMappingException) {
            logger.warn(e) { "Failed to parse content [${xmlContent}]" }
            handleTaskErrorRequeue(
                taskToProcess, fetchedAt, PARSE_ERROR, Duration.ofDays(1), Duration.ofDays(30))
            return
          }

      if (taskMapper.contentHash != taskToProcess.previousDataHash) {
        taskMapper.buildNewTasksList().forEach(db::createFetchTask)
        taskMapper.buildKafkaMessage()?.let(kafkaClient::send)
      }

      handleTaskRequeue(
          taskToProcess,
          fetchedAt,
          taskMapper.contentHash,
          if (taskMapper.contentHash == taskToProcess.previousDataHash) UNCHANGED else SUCCESS,
          taskMapper.determineNextFetchAt())
    } catch (e: Exception) {
      // This is a catch-all for any errors that occur while processing a task.
      logger.error(e) {
        "Failed to process task [${taskToProcess.id}] with url [${taskToProcess.fetchUri}]"
      }
      // We want to make sure if we fail to process a task, we reschedule it to run again
      // with a delay so that we don't end up in a situation where we are constantly trying to
      // process a task that is failing.
      handleTaskErrorRequeue(
          taskToProcess, fetchedAt, UNKNOWN_ERROR, Duration.ofDays(1), Duration.ofDays(7))
    }
  }

  fun handleTaskErrorRequeue(
      task: DB.HilltopFetchTaskRow,
      fetchedAt: Instant,
      errorCode: DB.HilltopFetchStatus,
      minAmount: TemporalAmount,
      maxAmount: TemporalAmount
  ) =
      db.requeueTask(
          task.id,
          task.previousDataHash,
          HilltopFetchResult(fetchedAt, errorCode, null),
          randomTimeBetween(fetchedAt.plus(minAmount), fetchedAt.plus(maxAmount)))

  fun handleTaskRequeue(
      task: DB.HilltopFetchTaskRow,
      fetchedAt: Instant,
      newContentHash: String?,
      statusCode: DB.HilltopFetchStatus,
      nextFetchAt: Instant
  ) =
      db.requeueTask(
          task.id,
          newContentHash,
          HilltopFetchResult(fetchedAt, statusCode, newContentHash),
          nextFetchAt)
}

private fun randomTimeBetween(earliest: Instant, latest: Instant): Instant =
    earliest.plusMillis(Random.nextLong(Duration.between(earliest, latest).toMillis() + 1))
