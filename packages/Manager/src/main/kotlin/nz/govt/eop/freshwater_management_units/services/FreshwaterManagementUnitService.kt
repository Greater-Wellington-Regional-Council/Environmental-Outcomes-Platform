package nz.govt.eop.freshwater_management_units.services

import com.fasterxml.jackson.databind.ObjectMapper
import mu.KotlinLogging
import nz.govt.eop.FreshwaterManagementUnitsDataSources
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.models.toFeatureCollection
import nz.govt.eop.freshwater_management_units.repositories.FreshwaterManagementUnitRepository
import nz.govt.eop.utils.GeoJsonFetcher
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate
import java.net.URI

@Service
class FreshwaterManagementUnitService
@Autowired
constructor(
    private val repository: FreshwaterManagementUnitRepository,
    private val twsService: TangataWhenuaSiteService, // Include this service to get tangataWhenuaSites
    restTemplate: RestTemplate
) : GeoJsonFetcher(restTemplate) {

    private val logger = KotlinLogging.logger {}

    @Autowired lateinit var freshwaterManagementUnitsDataSources: FreshwaterManagementUnitsDataSources

    @Transactional
    fun deleteAll() {
        repository.deleteAll()
    }

    @Transactional
    fun loadFromArcGIS() {
        deleteAll()
        logger.info("Loading Freshwater Management Units from ArcGIS sources")

        freshwaterManagementUnitsDataSources.sources.forEach { source ->
            source.urls.forEach { fetchAndSave(it, source.name) }
        }
    }

    fun fetchAndSave(url: String, sourceName: String? = null) {
        logger.info { "Fetching and saving FMUs from $url" }
        fetchCache
            .computeIfAbsent(url) { fetchFeatureCollection(URI.create(it)) }
            .features
            .forEach { feature ->
                val objectMapper = ObjectMapper()

                val gid = (feature.properties["gid"] as? Number)?.toInt()
                val objectId = (feature.properties["objectid"] as? Number)?.toDouble()
                val fmuNo = (feature.properties["fmu_no"] as? Number)?.toInt()
                val location = feature.properties["location"] as? String
                val fmuName1 = feature.properties["fmu_name1"] as? String
                val fmuGroup = feature.properties["fmu_group"] as? String
                val shapeLeng = (feature.properties["shape_leng"] as? Number)?.toDouble()
                val shapeArea = (feature.properties["shape_area"] as? Number)?.toDouble()
                val byWhen = feature.properties["by_when"] as? String
                val fmuIssue = feature.properties["fmu_issue"] as? String
                val topFmuGrp = feature.properties["top_fmugrp"] as? String

                val geometry = objectMapper.writeValueAsString(feature.geometry)

                val propertiesJson = objectMapper.writeValueAsString(feature.properties)

                saveFreshwaterManagementUnit(
                    gid = gid,
                    objectId = objectId,
                    fmuNo = fmuNo,
                    location = location,
                    fmuName1 = fmuName1,
                    fmuGroup = fmuGroup,
                    shapeLeng = shapeLeng,
                    shapeArea = shapeArea,
                    byWhen = byWhen,
                    fmuIssue = fmuIssue,
                    topFmuGrp = topFmuGrp,
                    geomGeoJson = geometry,
                    propertiesJson = propertiesJson
                )
            }
    }

    private fun saveFreshwaterManagementUnit(
        gid: Int?,
        objectId: Double?,
        fmuNo: Int?,
        location: String?,
        fmuName1: String?,
        fmuGroup: String?,
        shapeLeng: Double?,
        shapeArea: Double?,
        byWhen: String?,
        fmuIssue: String?,
        topFmuGrp: String?,
        geomGeoJson: String,
        propertiesJson: String
    ) {
        repository.saveWithGeom(
            gid = gid,
            objectId = objectId,
            fmuNo = fmuNo,
            location = location,
            fmuName1 = fmuName1,
            fmuGroup = fmuGroup,
            shapeLeng = shapeLeng,
            shapeArea = shapeArea,
            byWhen = byWhen,
            fmuIssue = fmuIssue,
            topFmuGrp = topFmuGrp,
            geom = geomGeoJson,
            implementationIdeas = propertiesJson,
            otherInfo = propertiesJson,
            vpo = propertiesJson
        )
    }

    // Fetch FMU by latitude/longitude
    fun findFreshwaterManagementUnitByLatAndLng(
        lng: Double,
        lat: Double,
        srid: Int = FreshwaterManagementUnit.DEFAULT_SRID,
        includeTangataWhenuaSites: Boolean = true
    ): FreshwaterManagementUnit? {
        val fmu = repository.findAllByLngLat(lng, lat, srid).firstOrNull()

        if (includeTangataWhenuaSites && fmu != null) {
            fmu.tangataWhenuaSites =
                twsService.findTangataWhenuaInterestSitesForFMU(fmu).toFeatureCollection()
        }

        return fmu
    }

    // Fetch FMU by ID
    fun findFreshwaterManagementUnitById(
        id: Int,
        includeTangataWhenuaSites: Boolean = true
    ): FreshwaterManagementUnit? {
        val fmu = repository.findById(id).orElse(null)

        if (includeTangataWhenuaSites && fmu != null) {
            fmu.tangataWhenuaSites =
                twsService.findTangataWhenuaInterestSitesForFMU(fmu).toFeatureCollection()
        }

        return fmu
    }

    // Fetch FMUs intersecting with a GeoJSON shape
    fun findFreshwaterManagementUnitsByShape(
        geoJson: String,
        includeTangataWhenuaSites: Boolean = true
    ): List<FreshwaterManagementUnit> {
        val fmus = repository.findAllByGeoJson(geoJson)

        if (includeTangataWhenuaSites) {
            fmus.forEach { fmu: FreshwaterManagementUnit ->
                fmu.tangataWhenuaSites =
                    twsService.findTangataWhenuaInterestSitesForFMU(fmu).toFeatureCollection()
            }
        }

        return fmus
    }

    // Fetch all FMUs
    fun findAllFreshwaterManagementUnits(
        includeTangataWhenuaSites: Boolean = true
    ): List<FreshwaterManagementUnit> {
        val fmus = repository.findAll()

        if (includeTangataWhenuaSites) {
            fmus.forEach { fmu: FreshwaterManagementUnit ->
                fmu.tangataWhenuaSites =
                    twsService.findTangataWhenuaInterestSitesForFMU(fmu).toFeatureCollection()
            }
        }

        return fmus
    }
}