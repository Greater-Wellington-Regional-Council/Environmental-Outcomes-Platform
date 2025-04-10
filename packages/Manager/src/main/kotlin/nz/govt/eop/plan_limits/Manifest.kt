package nz.govt.eop.plan_limits

import java.math.BigInteger
import java.security.MessageDigest
import java.time.Instant
import org.jooq.DSLContext
import org.springframework.cache.annotation.CachePut
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Component

const val MANIFEST_CACHE_KEY = "QUERY_MANIFEST"

@Component
class Manifest(val queries: Queries, val context: DSLContext) {

  @Cacheable(cacheNames = [MANIFEST_CACHE_KEY])
  fun get(councilId: Int): Map<String, String> {
    return generate(councilId)
  }

  @CachePut(cacheNames = [MANIFEST_CACHE_KEY])
  fun update(councilId: Int): Map<String, String> {
    return generate(councilId)
  }

  private fun generate(councilId: Int): Map<String, String> {
    return mapOf(
        "updatedAt" to Instant.now().toString(),
        "/plan-limits/councils" to generateHash(queries.councils()),
        "/plan-limits/plan" to generateHash(queries.plan(councilId) ?: ""),
        "/plan-limits/plan-regions" to generateHash(queries.planRegions(councilId)),
        "/plan-limits/surface-water-limits" to generateHash(queries.surfaceWaterLimits(councilId)),
        "/plan-limits/ground-water-limits" to
            generateHash(queries.groundwaterWaterLimits(councilId)),
        "/plan-limits/surface-water-pnrp" to
            generateHash(queries.surfaceWaterPNRP(councilId, listOf())),
        "/plan-limits/ground-water-pnrp" to
            generateHash(queries.groundWaterPNRP(councilId, listOf())),
        "/plan-limits/flow-measurement-sites" to
            generateHash(queries.flowMeasurementSites(councilId)),
        "/plan-limits/flow-limits" to generateHash(queries.flowLimits(councilId)),
    )
  }

  private fun generateHash(value: String): String {
    val md5 = MessageDigest.getInstance("MD5")
    return BigInteger(1, md5.digest(value.toByteArray())).toString(16).padStart(32, '0')
  }

  fun tablesExistAndPopulated(): Boolean {
    return queries.tablesExist() && queries.tablePopulated("plan_regions")
  }
}
