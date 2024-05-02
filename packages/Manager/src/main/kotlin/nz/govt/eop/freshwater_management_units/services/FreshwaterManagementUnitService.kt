package nz.govt.eop.freshwater_management_units.services

import mu.KotlinLogging
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.models.TangataWhenuaSite
import nz.govt.eop.freshwater_management_units.repositories.FreshwaterManagementUnitRepository
import nz.govt.eop.freshwater_management_units.repositories.TangataWhenuaSiteRepository
import org.geojson.FeatureCollection
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class FreshwaterManagementUnitService
    @Autowired
    constructor(
        private val repository: FreshwaterManagementUnitRepository,
        private val tangataWhenuaSiteRepository: TangataWhenuaSiteRepository,
    ) {
        private val logger = KotlinLogging.logger {}

        fun findFreshwaterManagementUnitByLatAndLng(
            lng: Double,
            lat: Double,
            srid: Int = FreshwaterManagementUnit.DEFAULT_SRID,
        ): FreshwaterManagementUnit? {
            val fmus = repository.findAllByLngLat(lng, lat, srid)

            if (fmus.count() > 1) {
                logger.warn { "More than 1 FMUs found for lat: $lat, lng: $lng" }
            }

            return fmus.firstOrNull()
        }

        fun findAllFreshwaterManagementUnits(): List<FreshwaterManagementUnit> {
            return repository.findAll()
        }

        private fun filterFeatureCollection(
            fmu: FreshwaterManagementUnit,
            featureCollection: FeatureCollection,
        ): FeatureCollection {
            val filteredFeatures =
                featureCollection.features.filter { feature -> fmu == fmu && feature == feature }
            //                    val geometry = feature.geometry Geometry \//                    val
            // boundaryGeometry = WKTReader().read(fmu.boundary)
            //                    geometry.intersects(boundaryGeometry)
            //                }

            return FeatureCollection().apply { features = filteredFeatures }
        }

        private fun filterFeatureCollectionByFMU(
            fmu: FreshwaterManagementUnit,
            featureCollection: FeatureCollection,
        ): FeatureCollection {
            return filterFeatureCollection(fmu, featureCollection)
        }

        fun fetchTangataWhenuaInterestSitesForFMU(fmu: FreshwaterManagementUnit): Set<TangataWhenuaSite> {
            return tangataWhenuaSiteRepository.findAllIntersectingWithBoundary(fmu.boundary!!)
        }
    }
