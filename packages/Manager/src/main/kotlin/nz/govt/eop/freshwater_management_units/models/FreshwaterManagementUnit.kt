package nz.govt.eop.freshwater_management_units.models

import com.fasterxml.jackson.annotation.JsonIgnore
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType
import jakarta.persistence.*
import java.nio.ByteBuffer
import java.nio.ByteOrder
import org.apache.commons.codec.binary.Hex
import org.geojson.FeatureCollection
import org.hibernate.annotations.Formula
import org.hibernate.annotations.Type
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.geom.GeometryFactory
import org.locationtech.jts.geom.PrecisionModel
import org.locationtech.jts.io.ParseException
import org.locationtech.jts.io.WKBReader

@Entity
@Table(name = "freshwater_management_units")
data class FreshwaterManagementUnit(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Int? = null,
    @Column(name = "gid") val gid: Int? = 0,
    @Column(name = "objectid") val objectId: Double? = 0.0,
    @Column(name = "fmu_no") val fmuNo: Int? = 0,
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
    @Type(JsonBinaryType::class)
    @Column(columnDefinition = "jsonb")
    var farmPlanInfo: FarmPlanInfo = FarmPlanInfo(),
    @Formula("CAST(ST_AsGeoJSON(geom, 6 ,2) AS jsonb)") val boundary: String? = null,
    @JsonIgnore
    @Convert(converter = WKBGeometryConverter::class)
    @Column(name = "geom", columnDefinition = "geometry(GEOMETRY,4326)")
    var geom: Geometry? = null,
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

data class FarmPlanInfo(
    var implementationIdeas: String? = null,
    var culturalOverview: String? = null,
    var otherInfo: String? = null,
    var vpo: String? = null,
    var catchmentOverview: String? = null,
)

@Converter(autoApply = true)
class WKBGeometryConverter : AttributeConverter<Geometry?, ByteArray?> {
  override fun convertToDatabaseColumn(attribute: Geometry?): ByteArray? {
    return attribute?.let {
      it.srid = FreshwaterManagementUnit.DEFAULT_SRID
      org.locationtech.jts.io.WKBWriter(2).write(it)
    }
  }

  override fun convertToEntityAttribute(dbData: ByteArray?): Geometry? {
    return dbData?.let {
      try {
        val hexString = String(dbData)
        val decodedBytes: ByteArray = Hex.decodeHex(hexString)
        val byteBuffer = ByteBuffer.wrap(decodedBytes)

        byteBuffer.order(ByteOrder.LITTLE_ENDIAN)

        val geometryFactory =
            GeometryFactory(PrecisionModel(), FreshwaterManagementUnit.DEFAULT_SRID)
        val wkbReader = WKBReader(geometryFactory)
        val geometry = wkbReader.read(decodedBytes)
        if (geometry.srid == 0) {
          geometry.srid = FreshwaterManagementUnit.DEFAULT_SRID
        }
        return geometry
      } catch (e: ParseException) {
        println("ParseException converting WKB to Geometry: ${e.message}")
      } catch (e: IllegalArgumentException) {
        println("IllegalArgumentException converting WKB to Geometry: ${e.message}")
      } catch (e: Exception) {
        println("Exception converting WKB to Geometry: ${e.message}")
      }
      return null
    }
  }
}
