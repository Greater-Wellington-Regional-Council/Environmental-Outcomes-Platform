package nz.govt.eop.freshwater_management_units.mappers

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import nz.govt.eop.freshwater_management_units.models.FarmPlanInfo
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import org.geojson.Feature
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.io.geojson.GeoJsonReader
import org.springframework.stereotype.Component

@Component
class FreshwaterManagementUnitMapper : ObjectMapper() {

  fun fromFeature(feature: Feature): FreshwaterManagementUnit {
    val geoJsonReader = GeoJsonReader()
    val objectMapper = jacksonObjectMapper()

    val geometryJson: String = objectMapper.writeValueAsString(feature.geometry)

    val parsedGeometry: Geometry =
        try {
          val geom = geoJsonReader.read(geometryJson)
          geom.srid = FreshwaterManagementUnit.DEFAULT_SRID
          geom
        } catch (e: Exception) {
          throw IllegalArgumentException("Invalid GeoJSON geometry in feature: $geometryJson", e)
        }

    return FreshwaterManagementUnit(
        gid = (feature.properties["FID"] as? Number)?.toInt() ?: 0,
        objectId = (feature.properties["OBJECTID"] as? Number)?.toDouble() ?: 0.0,
        fmuNo = (feature.properties["FMU_No"] as? Number)?.toInt() ?: 0,
        fmuName1 = feature.properties["FMU_Name1"] as? String ?: "",
        fmuGroup = feature.properties["FMU_Group"] as? String ?: "",
        location = feature.properties["Location"] as? String ?: "",
        byWhen = feature.properties["By_when"] as? String ?: "",
        fmuIssue = feature.properties["FMU_issue"] as? String ?: "",
        topFmuGrp = feature.properties["Top_FMUGrp"] as? String ?: "",
        ecoliBase = feature.properties["Ecoli_base"] as? String ?: "",
        ecoliObj = feature.properties["Ecoli_Obj"] as? String ?: "",
        periBase = feature.properties["Peri_base"] as? String ?: "",
        periObj = feature.properties["Peri_Obj"] as? String ?: "",
        aToxBase = feature.properties["A_tox_base"] as? String ?: "",
        aToxObj = feature.properties["A_tox_Obj"] as? String ?: "",
        nToxBase = feature.properties["N_tox_base"] as? String ?: "",
        nToxObj = feature.properties["N_tox_Obj"] as? String ?: "",
        phytoBase = feature.properties["Phyto_base"] as? String ?: "",
        phytoObj = feature.properties["Phyto_Obj"] as? String ?: "",
        tnBase = feature.properties["TN_base"] as? String ?: "",
        tnObj = feature.properties["TN_Obj"] as? String ?: "",
        tpBase = feature.properties["TP_base"] as? String ?: "",
        tpObj = feature.properties["TP_Obj"] as? String ?: "",
        tliBase = feature.properties["TLI_base"] as? String ?: "",
        tliObj = feature.properties["TLI_Obj"] as? String ?: "",
        tssBase = feature.properties["TSS_base"] as? String ?: "",
        tssObj = feature.properties["TSS_Obj"] as? String ?: "",
        macroBase = feature.properties["Macro_base"] as? String ?: "",
        macroObj = feature.properties["Macro_Obj"] as? String ?: "",
        mciBase = feature.properties["MCI_base"] as? String ?: "",
        mciObj = feature.properties["MCI_Obj"] as? String ?: "",
        shapeArea = (feature.properties["Shape__Area"] as? Number)?.toDouble() ?: 0.0,
        shapeLeng = (feature.properties["Shape__Length"] as? Number)?.toDouble() ?: 0.0,
        farmPlanInfo =
            FarmPlanInfo(
                implementationIdeas = feature.properties["Implementation"] as? String?,
                culturalOverview = feature.properties["cultural_significance"] as? String?,
                otherInfo = feature.properties["Other"] as? String?,
                vpo = feature.properties["values_priorities_outcomes"] as? String?),
        geom = parsedGeometry)
  }
}
