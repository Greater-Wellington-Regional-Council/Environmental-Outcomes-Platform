package nz.govt.eop.hilltop_crawler.api.requests

import io.github.bucket4j.Bandwidth
import io.github.bucket4j.BlockingBucket
import io.github.bucket4j.Bucket
import java.io.ByteArrayOutputStream
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.nio.charset.Charset
import java.time.Duration
import mu.KotlinLogging
import org.springframework.stereotype.Component

@Component
class HilltopFetcher {

  private final val logger = KotlinLogging.logger {}
  private final val client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build()

  private final val bucketBandwidthLimit: Bandwidth = Bandwidth.simple(20, Duration.ofSeconds(1))
  private final val bucket: BlockingBucket =
      Bucket.builder().addLimit(bucketBandwidthLimit).build().asBlocking()

  fun fetch(fetchRequest: URI): String {
    bucket.consume(1)

    logger.trace { "Downloading $fetchRequest" }
    val request =
        HttpRequest.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .uri(fetchRequest)
            .timeout(Duration.ofSeconds(30))
            .build()

    val response = client.send(request, HttpResponse.BodyHandlers.ofInputStream())
    if (response.statusCode() == 200) {
      val baos = ByteArrayOutputStream()
      response.body().use { it.copyTo(baos) }
      return baos.toString(Charset.defaultCharset())
    } else {
      logger.warn { "Error Downloading $fetchRequest" }
      throw Exception("Download failed")
    }
  }
}
