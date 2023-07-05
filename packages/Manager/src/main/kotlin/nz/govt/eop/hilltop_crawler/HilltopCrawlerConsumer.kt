package nz.govt.eop.hilltop_crawler

import java.math.BigDecimal
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.ZoneOffset
import net.postgis.jdbc.geometry.Geometry
import nz.govt.eop.messages.HilltopDataMessage
import nz.govt.eop.si.jooq.tables.Councils.Companion.COUNCILS
import nz.govt.eop.si.jooq.tables.ObservationSites.Companion.OBSERVATION_SITES
import nz.govt.eop.si.jooq.tables.ObservationSitesMeasurements.Companion.OBSERVATION_SITES_MEASUREMENTS
import nz.govt.eop.si.jooq.tables.Observations.Companion.OBSERVATIONS
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.jooq.DSLContext
import org.jooq.impl.DSL.*
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component

const val HILLTOP_RAW_DATA_TOPIC_NAME = "hilltop.raw"

fun nzstFromString(value: String): OffsetDateTime =
    OffsetDateTime.of(LocalDateTime.parse(value), ZoneOffset.of("+12"))

@Component
class HilltopCrawlerConsumer(val context: DSLContext) {

  @KafkaListener(
      id = "nz.govt.eop.consumers.hilltop-raw",
      topics = [HILLTOP_RAW_DATA_TOPIC_NAME],
      concurrency = "16")
  fun processNewMessage(message: ConsumerRecord<String, HilltopDataMessage>) {

    when (message.value().type) {
      "SITES_LIST" -> processSites(message.value())
      "MEASUREMENT_DATA" -> processMeasurements(message.value())
    }
  }

  fun processSites(message: HilltopDataMessage) {
    val hilltopSitesXml = HilltopSitesParser.parseSites(message.xml)

    hilltopSitesXml.validSites().forEach {
      context
          .insertInto(
              OBSERVATION_SITES,
              OBSERVATION_SITES.COUNCIL_ID,
              OBSERVATION_SITES.NAME,
              OBSERVATION_SITES.LOCATION,
              OBSERVATION_SITES.CREATED_AT,
              OBSERVATION_SITES.UPDATED_AT)
          .select(
              select(
                      COUNCILS.ID,
                      value(it.name),
                      if ("NZMG".equals(hilltopSitesXml.projection)) {
                        field(
                            "ST_TRANSFORM(ST_GEOMFROMTEXT('POINT(${it.easting} ${it.northing})', 27200), 2193)",
                            Geometry::class.java)
                      } else {
                        field(
                            "ST_GEOMFROMTEXT('POINT(${it.easting} ${it.northing})', 2193)",
                            Geometry::class.java)
                      },
                      value(message.at.atOffset(ZoneOffset.UTC)),
                      value(message.at.atOffset(ZoneOffset.UTC)))
                  .from(COUNCILS)
                  .where(COUNCILS.STATS_NZ_ID.eq(message.councilId)))
          .onConflict(OBSERVATION_SITES.COUNCIL_ID, OBSERVATION_SITES.NAME)
          .doUpdate()
          .set(OBSERVATION_SITES.UPDATED_AT, message.at.atOffset(ZoneOffset.UTC))
          .execute()
    }
  }

  fun processMeasurements(message: HilltopDataMessage) {

    val measurementData = HilltopXmlParsers.parseSiteMeasurementData(message.xml.toByteArray())

    val siteId =
        context
            .select(OBSERVATION_SITES.ID)
            .from(OBSERVATION_SITES)
            .where(
                OBSERVATION_SITES.COUNCIL_ID.eq(
                    context
                        .select(COUNCILS.ID)
                        .from(COUNCILS)
                        .where(COUNCILS.STATS_NZ_ID.eq(message.councilId))))
            .and(OBSERVATION_SITES.NAME.eq(measurementData.siteId))
            .fetchOne(OBSERVATION_SITES.ID)
            ?: throw Exception(
                "Site ID not found for ${message.councilId} ${measurementData.siteId}")

    if (measurementData.measurements.isNotEmpty()) {
      val siteMeasurementsId =
          context
              .insertInto(
                  OBSERVATION_SITES_MEASUREMENTS,
                  OBSERVATION_SITES_MEASUREMENTS.SITE_ID,
                  OBSERVATION_SITES_MEASUREMENTS.MEASUREMENT_NAME,
                  OBSERVATION_SITES_MEASUREMENTS.FIRST_OBSERVATION_AT,
                  OBSERVATION_SITES_MEASUREMENTS.LAST_OBSERVATION_AT,
                  OBSERVATION_SITES_MEASUREMENTS.OBSERVATION_COUNT,
                  OBSERVATION_SITES_MEASUREMENTS.CREATED_AT,
                  OBSERVATION_SITES_MEASUREMENTS.UPDATED_AT)
              .values(
                  siteId,
                  measurementData.measurementName,
                  nzstFromString(measurementData.measurements.first().timestamp),
                  nzstFromString(measurementData.measurements.last().timestamp),
                  measurementData.measurements.size,
                  message.at.atOffset(ZoneOffset.UTC),
                  message.at.atOffset(ZoneOffset.UTC))
              .onConflict(
                  OBSERVATION_SITES_MEASUREMENTS.SITE_ID,
                  OBSERVATION_SITES_MEASUREMENTS.MEASUREMENT_NAME)
              .doUpdate()
              .set(OBSERVATION_SITES_MEASUREMENTS.UPDATED_AT, message.at.atOffset(ZoneOffset.UTC))
              .returningResult(OBSERVATION_SITES_MEASUREMENTS.ID)
              .fetch()

      val lists =
          measurementData.measurements
              .map {
                row(
                    siteMeasurementsId[0].value1(),
                    nzstFromString(it.timestamp),
                    BigDecimal(it.value),
                    message.at.atOffset(ZoneOffset.UTC),
                    message.at.atOffset(ZoneOffset.UTC))
              }
              .chunked(1000)

      lists.forEach { it ->
        context
            .insertInto(
                OBSERVATIONS,
                OBSERVATIONS.OBSERVATION_MEASUREMENT_ID,
                OBSERVATIONS.OBSERVED_AT,
                OBSERVATIONS.AMOUNT,
                OBSERVATIONS.CREATED_AT,
                OBSERVATIONS.UPDATED_AT)
            .valuesOfRows(it)
            .onConflict(OBSERVATIONS.OBSERVATION_MEASUREMENT_ID, OBSERVATIONS.OBSERVED_AT)
            .doNothing()
            .execute()
      }
    }
  }
}
