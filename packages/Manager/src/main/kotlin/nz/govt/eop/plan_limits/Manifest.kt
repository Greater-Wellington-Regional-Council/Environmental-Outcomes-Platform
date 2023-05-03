package nz.govt.eop.plan_limits

import java.math.BigInteger
import java.security.MessageDigest
import java.time.Instant
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.CachePut
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Component

const val MANIFEST_CACHE_KEY = "QUERY_MANIFEST"

@Component
class Manifest(@Autowired val queries: Queries) {

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
        //        "/plan-limits/councils" to generateHash(queries.councils()),
        "/plan-limits/council-regions" to generateHash(queries.councilRegions(councilId)),
    )
  }

  private fun generateHash(value: String): String {
    val md5 = MessageDigest.getInstance("MD5")
    return BigInteger(1, md5.digest(value.toByteArray())).toString(16).padStart(32, '0')
  }
}
