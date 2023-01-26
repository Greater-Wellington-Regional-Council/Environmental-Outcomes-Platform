package nz.govt.eop.geo

import java.math.BigInteger
import java.security.MessageDigest
import java.time.Instant
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
  fun get(): Map<String, String> {
    return generate()
  }

  @CachePut(cacheNames = arrayOf(MANIFEST_CACHE_KEY))
  fun update(): Map<String, String> {
    return generate()
  }

  private fun generate(): Map<String, String> {
    return mapOf(
        "updatedAt" to Instant.now().toString(),
        "/layers/councils" to generateHash(queries.councils()),
        "/layers/whaitua" to generateHash(queries.whaitua()),
        "/layers/surface_water_mgmt" to generateHash(queries.surfaceWaterManagementUnits()),
        "/layers/surface_water_mgmt_sub" to generateHash(queries.surfaceWaterManagementSubUnits()),
        "/layers/flow_management_sites" to generateHash(queries.flowManagementSites()),
        "/layers/minimum_flow_limit_boundaries" to
            generateHash(queries.minimumFlowLimitBoundaries()),
        "/layers/groundwater_zone_boundaries" to generateHash(queries.groundwaterZoneBoundaries()),
    )
  }

  private fun generateHash(value: String): String {
    val md5 = MessageDigest.getInstance("MD5")
    return BigInteger(1, md5.digest(value.toByteArray())).toString(16).padStart(32, '0')
  }
}
