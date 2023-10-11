package nz.govt.eop.hilltop_crawler.config

import com.fasterxml.jackson.databind.SerializationFeature
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder

@Configuration
class JacksonJsonConfig {
  @Bean
  fun jsonCustomizer(): Jackson2ObjectMapperBuilderCustomizer {
    return Jackson2ObjectMapperBuilderCustomizer { builder: Jackson2ObjectMapperBuilder ->
      builder.featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
    }
  }
}
