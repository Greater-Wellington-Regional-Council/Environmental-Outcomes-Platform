package nz.govt.eop.hilltop_crawler

import java.time.Instant
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.time.temporal.ChronoUnit.MINUTES
import mu.KotlinLogging
import nz.govt.eop.hilltop_crawler.db.DB
import nz.govt.eop.hilltop_crawler.db.DB.HilltopFetchTaskRequestType.*
import nz.govt.eop.hilltop_crawler.support.*
import nz.govt.eop.messages.HilltopDataMessage
import org.apache.kafka.clients.admin.NewTopic
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component("HilltopCrawlerTaskScheduler")
class TaskScheduler(
    val db: DB,
    @Qualifier("hilltopRawDataTopic") val dataTopic: NewTopic,
    val kafkaSender: KafkaTemplate<String, Any>
) {

  private val logger = KotlinLogging.logger {}

  @Scheduled(fixedDelay = 60_000 * 60)
  fun checkForNewSources() {
    val sources = db.listSources()

    sources.forEach {
      db.createFetchTask(
          DB.HilltopFetchTaskCreate(
              it.councilId,
              SITES_LIST,
              it.htsUrl,
              buildUrl(it.htsUrl).query,
              DB.HilltopFetchTaskState.PENDING))
    }
  }

  @Scheduled(fixedDelay = 10_000)
  fun processTasks() {
    logger.debug { "Processing tasks" }
    do {
      val taskToProcess = db.getNextTaskToProcess()

      if (taskToProcess != null) {
        logger.info { "Processing task ${taskToProcess.id}" }
        val fetchUri = rebuildHim(taskToProcess.baseUrl, taskToProcess.queryParams)
        val xmlContent = fetch(fetchUri)
        val contentHash = hashMessage(xmlContent)

        if (contentHash == taskToProcess.previousDataHash) {
          logger.info { "Content hash matches for $fetchUri" }
        } else {
          val isErrorXml = HilltopXmlParsers.isHilltopErrorXml(xmlContent)
          if (isErrorXml) {
            logger.info { "Error XML from Hilltop for $taskToProcess.url" }
          } else {

            when (taskToProcess.requestType) {
              SITES_LIST ->
                  processSitesXmlResponse(
                      taskToProcess.councilId, taskToProcess.baseUrl, xmlContent)
              MEASUREMENTS_LIST ->
                  processMeasurementListResponse(
                      taskToProcess.councilId, taskToProcess.baseUrl, xmlContent)
              MEASUREMENT_DATA -> Unit
            }

            // Send to Kafka
            kafkaSender.send(
                dataTopic.name(),
                taskToProcess.baseUrl,
                HilltopDataMessage(
                    taskToProcess.councilId,
                    taskToProcess.baseUrl,
                    taskToProcess.requestType.toString(),
                    xmlContent,
                    Instant.now()))
          }
        }
        db.requeueTask(taskToProcess.id, contentHash, Instant.now().plus(60, MINUTES))
        logger.info { "Processing task ${taskToProcess.id} finished" }
      }
    } while (taskToProcess != null)
    logger.debug { "Processing finished" }
  }

  private fun processSitesXmlResponse(councilId: Int, baseUrl: String, xmlContent: String) {
    val sitesXml = HilltopSitesParser.parseSites(xmlContent)
    sitesXml.sites
        .filter { it.isValidSite() }
        .forEach {
          db.createFetchTask(
              DB.HilltopFetchTaskCreate(
                  councilId,
                  MEASUREMENTS_LIST,
                  baseUrl,
                  buildUrl(baseUrl, it.name).query,
                  DB.HilltopFetchTaskState.PENDING))
        }
  }

  private fun processMeasurementListResponse(councilId: Int, baseUrl: String, xmlContent: String) {
    val measurementTypes = HilltopXmlParsers.parseMeasurementNames(xmlContent)
    measurementTypes.datasources
        .filter { it.name == "Rainfall" || it.name == "SCADA Rainfall" }
        .filter {
          LocalDateTime.parse(it.to)
              .atOffset(ZoneOffset.of("+12"))
              .isAfter(OffsetDateTime.now().minusDays(30))
        }
        .filter { it.type == "StdSeries" }
        .filter { it.measurements.isNotEmpty() }
        .forEach {
          db.createFetchTask(
              DB.HilltopFetchTaskCreate(
                  councilId,
                  MEASUREMENT_DATA,
                  baseUrl,
                  buildUrl(baseUrl, it.siteId, it.measurements.first().requestAs).query,
                  DB.HilltopFetchTaskState.PENDING))
        }
  }
}
