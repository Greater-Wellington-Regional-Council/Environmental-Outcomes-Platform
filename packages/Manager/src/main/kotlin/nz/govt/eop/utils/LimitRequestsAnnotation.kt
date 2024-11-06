package nz.govt.eop.utils

import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import io.github.resilience4j.ratelimiter.RateLimiter
import io.github.resilience4j.ratelimiter.RateLimiterConfig
import java.lang.annotation.Inherited
import java.time.Duration
import java.util.concurrent.TimeUnit
import kotlin.annotation.AnnotationRetention.RUNTIME
import kotlin.annotation.AnnotationTarget.FUNCTION
import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes

@Configuration
class CacheConfig {

  @Bean
  fun rateLimiterCache(): Cache<String, RateLimiter> {
    return Caffeine.newBuilder().expireAfterAccess(1, TimeUnit.HOURS).build<String, RateLimiter>()
  }
}

@Target(FUNCTION)
@Retention(RUNTIME)
@Inherited
annotation class LimitRequests(
    val header: String = "Referer", // Specify the header to use for identifying clients
    val limit: Int = 5, // Number of requests allowed per time period
    val periodInSeconds: Long = 1 // Time period for the rate limit
)

@Aspect
@Component
class RateLimitingAspect(private val rateLimiterCache: Cache<String, RateLimiter>) {

  private fun getOrCreateRateLimiter(
      clientId: String,
      limit: Int,
      periodInSeconds: Long
  ): RateLimiter {
    return rateLimiterCache.get(clientId) {
      RateLimiter.of(
          clientId,
          RateLimiterConfig.custom()
              .limitForPeriod(limit)
              .limitRefreshPeriod(Duration.ofSeconds(periodInSeconds))
              .timeoutDuration(Duration.ZERO)
              .build())
    } ?: RateLimiter.ofDefaults(clientId)
  }

  @Around("@annotation(limitRequests)")
  fun limitRequests(joinPoint: ProceedingJoinPoint, limitRequests: LimitRequests): Any {
    val request = RequestContextHolder.getRequestAttributes() as ServletRequestAttributes
    val headerValue = request.request.getHeader(limitRequests.header) ?: "default-client"
    val rateLimiter =
        getOrCreateRateLimiter(headerValue, limitRequests.limit, limitRequests.periodInSeconds)

    return if (rateLimiter.acquirePermission()) {
      joinPoint.proceed()
    } else {
      ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
          .body("Rate limit exceeded, please try again later.")
    }
  }
}
