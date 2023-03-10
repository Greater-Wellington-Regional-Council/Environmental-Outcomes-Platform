package nz.govt.eop.geo

import java.math.BigInteger
import java.security.MessageDigest
import java.time.Instant
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.CachePut
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Component

const val MANIFEST_CACHE_KEY = "QUERY_MANIFEST"

@Component
class GeoJsonQueryManifest(@Autowired val queries: GeoJsonQueries) {

  @Cacheable(cacheNames = [MANIFEST_CACHE_KEY])
  fun get(): Map<String, String> {
    return generate()
  }

  @CachePut(cacheNames = [MANIFEST_CACHE_KEY])
  fun update(): Map<String, String> {
    return generate()
  }

  private fun generate(): Map<String, String> {
    return mapOf(
        "updatedAt" to Instant.now().toString(),
        "/layers/councils" to generateHash(queries.councils()),
        "/layers/whaitua" to generateHash(queries.whaitua()),
        "/layers/surface-water-management-units" to
            generateHash(queries.surfaceWaterManagementUnits()),
        "/layers/surface-water-management-sub-units" to
            generateHash(queries.surfaceWaterManagementSubUnits()),
        "/layers/flow-management-sites" to generateHash(queries.flowManagementSites()),
        "/layers/flow-limits" to generateHash(queries.flowLimits()),
        "/layers/groundwater-zones" to generateHash(queries.getGroundwaterZones()),
    )
  }

  private fun generateHash(value: String): String {
    val md5 = MessageDigest.getInstance("MD5")
    return BigInteger(1, md5.digest(value.toByteArray())).toString(16).padStart(32, '0')
  }
}
