package nz.govt.eop.hilltop_crawler.config

import java.time.Duration
import org.springframework.boot.autoconfigure.web.client.RestTemplateBuilderConfigurer
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.client.RestTemplate

@Configuration
class RestTemplateConfig {
  @Bean
  fun restTemplateBuilder(
      restTemplateBuilderConfigurer: RestTemplateBuilderConfigurer
  ): RestTemplateBuilder {
    val builder =
        RestTemplateBuilder()
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(30))
    restTemplateBuilderConfigurer.configure(builder)
    return builder
  }

  @Bean fun restTemplate(): RestTemplate = RestTemplateBuilder().build()
}
