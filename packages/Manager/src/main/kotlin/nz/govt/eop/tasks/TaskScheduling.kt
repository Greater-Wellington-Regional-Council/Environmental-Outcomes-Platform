package nz.govt.eop.tasks

import org.jooq.*
import org.jooq.impl.DSL.*
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder


// data class GeojsonObject (
//   var
// )

@Component
class ScheduleTasks (val context: DSLContext, val restTemplate: RestTemplate) {

  @Scheduled(fixedRate = 60000)
  fun updateWhaituaBoundaries() {

    // Get data

    val url = UriComponentsBuilder.fromHttpUrl("https://mapping.gw.govt.nz/arcgis/rest/services/GW/NRPMap_P_operative/MapServer/119/query?where=1%3D1&outFields=*&f=geojson").build().toUri()

    // val test = restTemplate.getForObject(url)

    //// RestTemplate - spring

    // FuelManager.instance.basePath = "https://mapping.gw.govt.nz/arcgis/rest/services/GW"
    // FuelManager.instance.baseParams = listOf("where" to "1=1", "outFields" to "*", "f" to "geojson")

    // val (request, response, result) = Fuel.get("/NRPMap_P_operative/MapServer/119/query").response()
    // println(response)

    // deserialise

    //// jackson deserialise json and maybe specificaly geojson

    // write to db

    //// jooq

  }
}
