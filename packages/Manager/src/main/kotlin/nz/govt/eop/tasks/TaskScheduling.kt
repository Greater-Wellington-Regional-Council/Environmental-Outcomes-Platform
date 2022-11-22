package nz.govt.eop.tasks

import org.jooq.*
import org.jooq.impl.DSL.*
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder
import org.geojson.GeoJsonObject

@Component
class ScheduleTasks(val context: DSLContext, val restTemplate: RestTemplate) {

  @Scheduled(fixedRate = 600000)
  fun updateWhaituaBoundaries() {

   val url = UriComponentsBuilder
             .fromHttpUrl("https://mapping.gw.govt.nz/arcgis/rest/services/GW/NRPMap_P_operative/MapServer/119/query?where=1=1&outFields=*&f=geojson")
             .build()
             .toUri()

  // Get data
  
  // Trying with restTemplate
  val whaitua_geojson = restTemplate.getForObject(url, GeoJsonObject::class.java)

  println(whaitua_geojson)

  // write to db

  //// jooq
.
  }
}
