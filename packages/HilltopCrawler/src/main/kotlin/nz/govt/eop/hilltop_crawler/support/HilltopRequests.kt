package nz.govt.eop.hilltop_crawler.support

import java.io.ByteArrayOutputStream
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.nio.charset.Charset
import java.time.Duration
import mu.KotlinLogging
import org.springframework.web.util.DefaultUriBuilderFactory

private val logger = KotlinLogging.logger {}
private val client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build()

fun buildUrl(hilltopUrl: String): URI =
    DefaultUriBuilderFactory()
        .uriString(hilltopUrl)
        .queryParam("Service", "Hilltop")
        .queryParam("Request", "SiteList")
        .queryParam("Location", "Yes")
        .queryParam("Measurement", "Rainfall")
        .build()

fun buildUrl(hilltopUrl: String, siteId: String): URI =
    DefaultUriBuilderFactory()
        .uriString(hilltopUrl)
        .queryParam("Service", "Hilltop")
        .queryParam("Request", "MeasurementList")
        .queryParam("Site", siteId)
        .build()

fun buildUrl(hilltopUrl: String, siteId: String, measurementName: String): URI =
    DefaultUriBuilderFactory()
        .uriString(hilltopUrl)
        .queryParam("Service", "Hilltop")
        .queryParam("Request", "GetData")
        .queryParam("Site", siteId)
        .queryParam("Measurement", measurementName)
        .queryParam("TimeInterval", "P30D/now")
        .build()

fun rebuildHim(baseUrl: String, queryParams: String): URI =
    DefaultUriBuilderFactory().uriString(baseUrl).query(queryParams).build()

fun fetch(fetchRequest: URI): String {

  logger.trace { "Downloading ${fetchRequest}" }
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
    logger.warn { "Error Downloading ${fetchRequest}" }
    throw Exception("Download failed")
  }
}
