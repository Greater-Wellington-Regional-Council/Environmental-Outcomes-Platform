package nz.govt.eop.utils

import com.github.benmanes.caffeine.cache.Cache
import io.github.resilience4j.ratelimiter.RateLimiter
import jakarta.servlet.http.HttpServletRequest
import org.aspectj.lang.ProceedingJoinPoint
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.*
import org.mockito.MockitoAnnotations
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes

class RateLimitingAspectTest {

  @InjectMocks private lateinit var rateLimitingAspect: RateLimitingAspect

  @Mock private lateinit var joinPoint: ProceedingJoinPoint

  @Mock private lateinit var requestAttributes: ServletRequestAttributes

  @Mock private lateinit var request: HttpServletRequest

  @Mock private lateinit var rateLimiterCache: Cache<String, RateLimiter>

  @Mock private lateinit var rateLimiter: RateLimiter

  @BeforeEach
  fun setup() {
    MockitoAnnotations.openMocks(this)
    `when`(requestAttributes.request).thenReturn(request)
    RequestContextHolder.setRequestAttributes(requestAttributes)
  }

  @Test
  fun shouldAllowRequestIfWithinRateLimit() {
    `when`(request.getHeader("Referer")).thenReturn("client-1")
    `when`(joinPoint.proceed()).thenReturn(ResponseEntity.ok("Request successful"))

    doReturn(rateLimiter).`when`(rateLimiterCache).get(eq("client-1"), any())
    `when`(rateLimiter.acquirePermission()).thenReturn(true)

    val result =
        rateLimitingAspect.limitRequests(joinPoint, LimitRequests(limit = 5, periodInSeconds = 1))

    assertEquals(HttpStatus.OK, (result as ResponseEntity<*>).statusCode)
    assertEquals("Request successful", result.body)
    verify(joinPoint, times(1)).proceed()
  }

  @Test
  fun shouldRejectRequestWith429IfRateLimitExceeded() {
    `when`(request.getHeader("Referer")).thenReturn("client-2")
    `when`(joinPoint.proceed()).thenReturn(ResponseEntity.ok("Request successful"))

    doReturn(rateLimiter).`when`(rateLimiterCache).get(eq("client-2"), any())
    `when`(rateLimiter.acquirePermission()).thenReturn(false)

    val result =
        rateLimitingAspect.limitRequests(joinPoint, LimitRequests(limit = 1, periodInSeconds = 1))

    assertEquals(HttpStatus.TOO_MANY_REQUESTS, (result as ResponseEntity<*>).statusCode)
    assertEquals("Rate limit exceeded, please try again later.", result.body)
    verify(joinPoint, times(0)).proceed()
  }
}
