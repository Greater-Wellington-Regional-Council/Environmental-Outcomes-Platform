package nz.govt.eop.tasks

import com.fasterxml.jackson.databind.ObjectMapper
import nz.govt.eop.si.jooq.tables.GroundwaterZones
import nz.govt.eop.si.jooq.tables.WhaituaBoundaries
import org.geojson.FeatureCollection
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder
import mu.KotlinLogging

@Component
class ScheduleTasks(val context: DSLContext, val restTemplate: RestTemplate) {

  private val logger = KotlinLogging.logger {}

  @Scheduled(fixedDelay = 86400000) // once a day
  fun updateWhaituaBoundaries() {

    val url =
        UriComponentsBuilder.newInstance()
            .scheme("https")
            .host("mapping.gw.govt.nz")
            .path("/arcgis/rest/services/GW/NRPMap_P_operative/MapServer/119/query")
            .query("where=1=1&outFields=*&f=geojson")
            .build()
            .toUri()

    // println(url)
    logger.info { "Making GET request for Whaitua data.." }

    var whaitua_features = restTemplate.getForObject(url, FeatureCollection::class.java)

    if (whaitua_features != null) {

      logger.info { "Writing data to the database.." }

      context.deleteFrom(WhaituaBoundaries.WHAITUA_BOUNDARIES).execute()

      for (feature in whaitua_features.features) {

        ///
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
    }
    logger.info { "Finished updataing Whaitua data." }
  }
  @Scheduled(fixedDelay = 86400000, initialDelay = 500) // once a day
  fun updateGroundwaterZones() {

    logger.info { "Making GET request for Groundwater Zones data.." }

    val url =
        UriComponentsBuilder.newInstance()
            .scheme("https")
            .host("services2.arcgis.com")
            .path(
                "/RS7BXJAO6ksvblJm/arcgis/rest/services/Groundwater_zones_in_the_Wellington_Region/FeatureServer/0/query")
            .query("where=1=1&outFields=*&f=geojson")
            .build()
            .toUri()

    var groundwater_result = restTemplate.getForObject(url, FeatureCollection::class.java)

    if (groundwater_result != null) {

      logger.info { "Writing data to the database.." }

      context.deleteFrom(GroundwaterZones.GROUNDWATER_ZONES).execute()

      for (feature in groundwater_result.features) {

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
    }
    logger.info { "Finished updataing Groundwater Zones data." }
  }
}
