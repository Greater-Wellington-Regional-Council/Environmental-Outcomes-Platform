import nz.govt.eop.filter.LoggingFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.function.client.WebClient

@Configuration
class WebClientConfig {

  @Bean
  fun webClient(): WebClient {
    return WebClient.builder()
        .filter(LoggingFilter.logRequest())
        .filter(LoggingFilter.logResponse())
        .build()
  }
}
