package nz.govt.eop.freshwater_management_units.models

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.*
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import jakarta.persistence.*
import java.io.IOException
import kotlin.jvm.Transient
import org.geojson.FeatureCollection
import org.hibernate.annotations.Formula

class GeoJsonSerializer : JsonSerializer<String>() {
  private val objectMapper = ObjectMapper()

  override fun serialize(
      value: String?,
      gen: JsonGenerator,
      serializers: SerializerProvider,
  ) {
    val geoJson: JsonNode = objectMapper.readTree(value)
    gen.writeObject(geoJson)
  }
}

internal class GeoJsonDeserializer : JsonDeserializer<JsonNode>() {
  private val mapper = ObjectMapper()

  override fun deserialize(
      jp: JsonParser,
      ctxt: DeserializationContext,
  ): JsonNode {
    try {
      return mapper.readTree(jp)
    } catch (e: IOException) {
      println("Error deserializing GeoJSON: " + e.message)
      throw RuntimeException("Failed to deserialize GeoJSON", e)
    }
  }
}

@Entity
@Table(name = "freshwater_management_units")
data class FreshwaterManagementUnit(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Int? = null,
    @Column(name = "gid") val gid: Int? = 0,
    @Column(name = "objectid") val objectId: Double = 0.0,
    @Column(name = "fmu_no") val fmuNo: Int = 0,
    @Column(name = "location") val location: String? = "",
    @Column(name = "fmu_name1") val fmuName1: String? = "",
    @Column(name = "fmu_group") val fmuGroup: String? = "",
    @Column(name = "shape_leng") val shapeLeng: Double? = 0.0,
    @Column(name = "shape_area") val shapeArea: Double? = 0.0,
    @Column(name = "by_when") val byWhen: String? = "",
    @Column(name = "fmu_issue") val fmuIssue: String? = "",
    @Column(name = "top_fmugrp") val topFmuGrp: String? = "",
    @Column(name = "ecoli_base") var ecoliBase: String? = null,
    @Column(name = "peri_base") var periBase: String? = null,
    @Column(name = "peri_obj") var periObj: String? = null,
    @Column(name = "a_tox_base") var aToxBase: String? = null,
    @Column(name = "a_tox_obj") var aToxObj: String? = null,
    @Column(name = "n_tox_base") var nToxBase: String? = null,
    @Column(name = "n_tox_obj") var nToxObj: String? = null,
    @Column(name = "phyto_base") var phytoBase: String? = null,
    @Column(name = "phyto_obj") var phytoObj: String? = null,
    @Column(name = "tn_base") var tnBase: String? = null,
    @Column(name = "tn_obj") var tnObj: String? = null,
    @Column(name = "tp_base") var tpBase: String? = null,
    @Column(name = "tp_obj") var tpObj: String? = null,
    @Column(name = "tli_base") var tliBase: String? = null,
    @Column(name = "tli_obj") var tliObj: String? = null,
    @Column(name = "tss_base") var tssBase: String? = null,
    @Column(name = "tss_obj") var tssObj: String? = null,
    @Column(name = "macro_base") var macroBase: String? = null,
    @Column(name = "macro_obj") var macroObj: String? = null,
    @Column(name = "mci_base") var mciBase: String? = null,
    @Column(name = "mci_obj") var mciObj: String? = null,
    @Column(name = "ecoli_obj") var ecoliObj: String? = null,
    @Column(name = "implementation_ideas") var implementationIdeas: String? = null,
    @JsonSerialize(using = GeoJsonSerializer::class)
    @JsonDeserialize(using = GeoJsonDeserializer::class)
    @Formula("CAST(ST_AsGeoJSON(ST_Transform(geom, 4326), 6 ,2) AS jsonb)")
    var boundary: String? = null,
    @Basic(fetch = FetchType.LAZY)
    @Formula(
        """(
        SELECT bi.description
        FROM boundary_info bi
        JOIN council_plan_boundaries cpb
        ON cpb.source_id = bi.source_id AND cpb.council_id = bi.council_id
        WHERE ST_Intersects(ST_Transform(cpb.boundary, 4326), ST_Transform(geom, 4326))
        AND bi.context = 'cccv_catchments'
        LIMIT 1
    )""",
    )
    val catchmentDescription: String? = null,
    @Transient var tangataWhenuaSites: FeatureCollection? = null,
) {
  companion object {
    const val DEFAULT_SRID = 4326
  }
}
