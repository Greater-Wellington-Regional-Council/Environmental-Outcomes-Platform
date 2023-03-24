package nz.govt.eop.tasks

import com.fasterxml.jackson.databind.ObjectMapper
import java.net.URI
import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import net.postgis.jdbc.geometry.Geometry
import nz.govt.eop.si.jooq.tables.GroundwaterZones
import nz.govt.eop.si.jooq.tables.WhaituaBoundaries
import org.geojson.FeatureCollection
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.http.HttpStatus
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder

@Component
class GisDataFetcher(val context: DSLContext, val restTemplate: RestTemplate) {

  private val logger = KotlinLogging.logger {}

  private fun fetchFeatureCollection(url: URI): FeatureCollection {
    val resp = restTemplate.getForEntity(url, FeatureCollection::class.java)
    if (resp.statusCode == HttpStatus.OK) {
      return resp.body!!
    } else {
      throw RuntimeException("Request failed with status: ${resp.statusCode} ")
    }
  }

  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.DAYS)
  @SchedulerLock(name = "updateWhaituaBoundaries")
  fun updateWhaituaBoundaries() {
    logger.info { startTaskMessage("updateWhaituaBoundaries") }

    val url =
        UriComponentsBuilder.newInstance()
            .scheme("https")
            .host("mapping.gw.govt.nz/arcgis/rest/services")
            .path("/GW/NRPMap_P_operative/MapServer/119/query")
            .query("where=1=1&outFields=*&f=geojson")
            .build()
            .toUri()

    storeWhaituaBoundaries(fetchFeatureCollection(url))

    logger.info { endTaskMessage("updateWhaituaBoundaries") }
  }

  @Transactional
  fun storeWhaituaBoundaries(featureCollection: FeatureCollection) {
    context.deleteFrom(WhaituaBoundaries.WHAITUA_BOUNDARIES).execute()

    for (feature in featureCollection.features) {
      context
          .insertInto(
              WhaituaBoundaries.WHAITUA_BOUNDARIES,
              WhaituaBoundaries.WHAITUA_BOUNDARIES.ID,
              WhaituaBoundaries.WHAITUA_BOUNDARIES.NAME,
              WhaituaBoundaries.WHAITUA_BOUNDARIES.GEOM)
          .values(
              DSL.value(Integer.valueOf(feature.id)),
              DSL.value((feature.properties["Name"] as String).trim()),
              DSL.field(
                  "ST_GeomFromGeoJSON(?)",
                  Geometry::class.java,
                  ObjectMapper().writeValueAsString(feature.geometry)))
          .execute()
    }
  }

  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.DAYS)
  @SchedulerLock(name = "updateGroundwaterZones")
  fun updateGroundwaterZones() {
    logger.info { startTaskMessage("updateGroundwaterZones") }

    val url =
        UriComponentsBuilder.newInstance()
            .scheme("https")
            .host("services2.arcgis.com/RS7BXJAO6ksvblJm/arcgis/rest/services")
            .path("/Groundwater_zones_in_the_Wellington_Region/FeatureServer/0/query")
            .query("where=1=1&outFields=*&f=geojson")
            .build()
            .toUri()

    storeGroundwaterZones(fetchFeatureCollection(url))

    logger.info { endTaskMessage("updateGroundwaterZones") }
  }

  @Transactional
  fun storeGroundwaterZones(featureCollection: FeatureCollection) {
    context.deleteFrom(GroundwaterZones.GROUNDWATER_ZONES).execute()

    for (feature in featureCollection.features) {

      context
          .insertInto(
              GroundwaterZones.GROUNDWATER_ZONES,
              GroundwaterZones.GROUNDWATER_ZONES.ID,
              GroundwaterZones.GROUNDWATER_ZONES.NAME,
              GroundwaterZones.GROUNDWATER_ZONES.CATEGORY,
              GroundwaterZones.GROUNDWATER_ZONES.DEPTH,
              GroundwaterZones.GROUNDWATER_ZONES.NOTES,
              GroundwaterZones.GROUNDWATER_ZONES.GROUNDWATER_ZONE,
              GroundwaterZones.GROUNDWATER_ZONES.ALLOCATION_AMOUNT_ID,
              GroundwaterZones.GROUNDWATER_ZONES.GEOM)
          .values(
              DSL.value((feature.id as String).trim()),
              DSL.value((feature.properties["Name"] as String).trim()),
              DSL.value((feature.properties["Category"] as String).trim()),
              DSL.value((feature.properties["Depth"] as String).trim()),
              DSL.value((feature.properties["Description"] as String).trim()),
              DSL.value((feature.properties["Zone"] as String).trim()),
              DSL.value(feature.properties["AllocationAmount_Groundwater_ID"] as Int),
              DSL.field(
                  "ST_GeomFromGeoJSON(?)",
                  Geometry::class.java,
                  ObjectMapper().writeValueAsString(feature.geometry)))
          .execute()
    }
  }
}
