package nz.govt.eop.config

import org.springframework.boot.autoconfigure.cache.CacheManagerCustomizer
import org.springframework.cache.concurrent.ConcurrentMapCacheManager
import org.springframework.stereotype.Component

@Component
class CacheCustomizer : CacheManagerCustomizer<ConcurrentMapCacheManager> {

  override fun customize(cacheManager: ConcurrentMapCacheManager) {}
}
