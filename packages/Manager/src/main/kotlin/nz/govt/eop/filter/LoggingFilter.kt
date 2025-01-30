package nz.govt.eop.filter

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.reactive.function.client.ExchangeFilterFunction
import reactor.core.publisher.Mono

object LoggingFilter {
  private val logger: Logger = LoggerFactory.getLogger(LoggingFilter::class.java)

  private fun logHeaders(headers: Map<String, List<String>>) {
    headers.forEach { (name, values) ->
      values.forEach { value -> logger.info("Header: {}: {}", name, value) }
    }
  }

  fun logRequest(): ExchangeFilterFunction {
    return ExchangeFilterFunction.ofRequestProcessor { request ->
      val fullUrl = request.url().toString()
      logger.info("Request: Method: {}", request.method())
      logger.debug("* URL: {}", fullUrl)
      logger.debug("* Body: {}", request.body())
      logHeaders(request.headers())
      Mono.just(request)
    }
  }

  fun logResponse(): ExchangeFilterFunction {
    return ExchangeFilterFunction.ofResponseProcessor { response ->
      logger.info("Response Status: {}", response.statusCode())
      logHeaders(response.headers().asHttpHeaders().toMap())

      response.bodyToMono(String::class.java).flatMap { body ->
        logger.debug("Response Body: {}", body)
        Mono.just(response)
      }
    }
  }
}
