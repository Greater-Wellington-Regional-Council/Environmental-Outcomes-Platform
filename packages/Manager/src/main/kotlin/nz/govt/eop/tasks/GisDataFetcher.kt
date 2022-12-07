package nz.govt.eop.tasks

import com.fasterxml.jackson.databind.ObjectMapper
import java.net.URI
import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
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

  fun getGeoJson(url: URI): FeatureCollection {
    val resp = restTemplate.getForEntity(url, FeatureCollection::class.java)
    if (resp.statusCode == HttpStatus.OK) {
      return resp.body!!
    } else {
      throw RuntimeException("Request failed with status: ${resp.statusCode} ")
    }
  }

  @Transactional
  fun materialiseWhaituaGeoJson(featureCollection: FeatureCollection) {
    logger.info { "Updating Whaitua database table .." }

    context.deleteFrom(WhaituaBoundaries.WHAITUA_BOUNDARIES).execute()

    for (feature in featureCollection.features) {
      context
          .insertInto(
              WhaituaBoundaries.WHAITUA_BOUNDARIES,
              WhaituaBoundaries.WHAITUA_BOUNDARIES.NAME,
              WhaituaBoundaries.WHAITUA_BOUNDARIES.GEOM)
          .values(
              DSL.value(feature.properties.get("Name") as String),
              DSL.field(
                  "ST_GeomFromGeoJSON(?)",
                  ByteArray::class.java,
                  ObjectMapper().writeValueAsString(feature.geometry)))
          .execute()
    }

    logger.info { "Finished updating Whaitua data." }
  }

  @Transactional
  fun materialiseGroundwaterGeoJson(featureCollection: FeatureCollection) {
    logger.info { "Updating Groundwater database table.." }

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
              GroundwaterZones.GROUNDWATER_ZONES.GEOM)
          .values(
              DSL.value(feature.id as String),
              DSL.value(feature.properties.get("Name") as String),
              DSL.value(feature.properties.get("Category") as String),
              DSL.value(feature.properties.get("Depth") as String),
              DSL.value(feature.properties.get("Description") as String),
              DSL.field(
                  "ST_GeomFromGeoJSON(?)",
                  ByteArray::class.java,
                  ObjectMapper().writeValueAsString(feature.geometry)))
          .execute()
    }

    logger.info { "Finished updating Groundwater Zones data." }
  }

  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.DAYS)
  @SchedulerLock(name = "updateWhaituaBoundaries")
  fun updateWhaituaBoundaries() {

    logger.info { "Getting new Whaitua data .." }

    val url =
        UriComponentsBuilder.newInstance()
            .scheme("https")
            .host("mapping.gw.govt.nz/arcgis/rest/services")
            .path("/GW/NRPMap_P_operative/MapServer/119/query")
            .query("where=1=1&outFields=*&f=geojson")
            .build()
            .toUri()

    val whaitua_geojson = getGeoJson(url)

    materialiseWhaituaGeoJson(whaitua_geojson)
  }

  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.DAYS)
  @SchedulerLock(name = "updateGroundwaterZones")
  fun updateGroundwaterZones() {

    logger.info { "Getting new Groundwater zone data .." }

    val url =
        UriComponentsBuilder.newInstance()
            .scheme("https")
            .host("services2.arcgis.com/RS7BXJAO6ksvblJm/arcgis/rest/services")
            .path("/Groundwater_zones_in_the_Wellington_Region/FeatureServer/0/query")
            .query("where=1=1&outFields=*&f=geojson")
            .build()
            .toUri()

    val groundwater_geojson = getGeoJson(url)

    materialiseGroundwaterGeoJson(groundwater_geojson)
  }
}
