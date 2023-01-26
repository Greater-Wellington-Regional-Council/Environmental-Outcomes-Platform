package nz.govt.eop.geo

import java.math.BigInteger
import java.security.MessageDigest
import mu.KotlinLogging
import org.jooq.*
import org.jooq.impl.DSL.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.CachePut
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Component

const val MANIFEST_CACHE_KEY = "QUERY_MANIFEST"

@Component
class GeoJsonQueryManifest(@Autowired val queries: GeoJsonQueries) {

  private val logger = KotlinLogging.logger {}

  @Cacheable(cacheNames = arrayOf(MANIFEST_CACHE_KEY))
  fun get(): HashMap<String, String> {
    logger.info { "GeoJsonQueryManifest.get" }
    return generate()
  }

  @CachePut(cacheNames = arrayOf(MANIFEST_CACHE_KEY))
  fun update(): HashMap<String, String> {
    logger.info { "GeoJsonQueryManifest.update" }
    return generate()
  }

  private fun generate(): HashMap<String, String> {
    val map = HashMap<String, String>()
    // TODO: Format as JSON
    map.put("updatedAt", System.currentTimeMillis().toString())
    map.put("/layers/councils", generateHash(queries.councils()))
    map.put("/layers/whaitua", generateHash(queries.whaitua()))
    map.put("/layers/surface_water_mgmt", generateHash(queries.surfaceWaterManagementUnits()))
    map.put(
        "/layers/surface_water_mgmt_sub", generateHash(queries.surfaceWaterManagementSubUnits()))
    map.put("/layers/flow_management_sites", generateHash(queries.flowManagementSites()))
    map.put(
        "/layers/minimum_flow_limit_boundaries", generateHash(queries.minimumFlowLimitBoundaries()))
    map.put(
        "/layers/groundwater_zone_boundaries", generateHash(queries.groundwaterZoneBoundaries()))
    return map
  }

  private fun generateHash(value: String): String {
    val md5 = MessageDigest.getInstance("MD5")
    return BigInteger(1, md5.digest(value.toByteArray())).toString(16).padStart(32, '0')
  }
}
