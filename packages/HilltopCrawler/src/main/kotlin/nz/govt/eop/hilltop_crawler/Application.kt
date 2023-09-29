package nz.govt.eop.hilltop_crawler

import com.fasterxml.jackson.databind.SerializationFeature
import java.time.Duration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.web.client.RestTemplate

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties(ApplicationConfiguration::class)
class Application {

  @Bean
  fun jsonCustomizer(): Jackson2ObjectMapperBuilderCustomizer {
    return Jackson2ObjectMapperBuilderCustomizer { builder: Jackson2ObjectMapperBuilder ->
      builder.featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
    }
  }

  @Bean
  fun restTemplateBuilder(): RestTemplate =
      RestTemplateBuilder()
          .setConnectTimeout(Duration.ofSeconds(5))
          .setReadTimeout(Duration.ofSeconds(30))
          .build()
}

fun main(args: Array<String>) {
  System.setProperty("com.sun.security.enableAIAcaIssuers", "true")
  runApplication<Application>(*args)
}
