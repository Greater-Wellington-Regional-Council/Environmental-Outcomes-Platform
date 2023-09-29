package nz.govt.eop.hilltop_crawler.api.requests

import io.github.bucket4j.Bandwidth
import io.github.bucket4j.BlockingBucket
import io.github.bucket4j.Bucket
import java.net.URI
import java.time.Duration
import mu.KotlinLogging
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate

/**
 * Simple wrapper around RestTemplate to limit the number of requests per second This is to avoid
 * overloading the Hilltop servers
 *
 * Could be extended to have a bucket per host to increase throughput. But currently the bottleneck
 * is when initially loading data from Hilltop, which ends up effectively processing one host at a
 * time.
 */
@Component
class HilltopFetcher(val restTemplate: RestTemplate) {

  private final val logger = KotlinLogging.logger {}

  private final val bucketBandwidthLimit: Bandwidth = Bandwidth.simple(20, Duration.ofSeconds(1))
  private final val bucket: BlockingBucket =
      Bucket.builder().addLimit(bucketBandwidthLimit).build().asBlocking()

  fun fetch(fetchRequest: URI): String? {
    bucket.consume(1)
    logger.trace { "Downloading $fetchRequest" }
    return try {
      restTemplate.getForObject(fetchRequest, String::class.java)
    } catch (e: RestClientException) {
      logger.info(e) { "Failed to download $fetchRequest" }
      null
    }
  }
}
