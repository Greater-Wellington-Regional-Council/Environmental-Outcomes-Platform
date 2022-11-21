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

  @Scheduled(fixedRate = 60000)
  fun updateWhaituaBoundaries() {

   val url = UriComponentsBuilder
             .fromHttpUrl("https://mapping.gw.govt.nz/arcgis/rest/services/GW/NRPMap_P_operative/MapServer/119/query?where=1=1&outFields=*&f=geojson")
             .build()
             .toUri()

  // Get data
  
  // Trying with restTemplate
  val response = restTemplate.getForObject(url, GeoJsonObject::class.java)

  println(response)

  //// RestTemplate - spring

  // deserialise

  //// jackson deserialise json and maybe specificaly geojson

  // write to db

  //// jooq

  }
}
