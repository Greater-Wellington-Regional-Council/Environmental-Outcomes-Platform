package nz.govt.eop.hilltop_crawler

import java.security.MessageDigest
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder
import org.springframework.kafka.annotation.EnableKafka
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
@EnableKafka
@EnableConfigurationProperties(ApplicationConfiguration::class)
class Application {

  @Bean
  fun jsonCustomizer(): Jackson2ObjectMapperBuilderCustomizer {
    return Jackson2ObjectMapperBuilderCustomizer { _: Jackson2ObjectMapperBuilder -> }
  }
}

fun main(args: Array<String>) {
  System.setProperty("com.sun.security.enableAIAcaIssuers", "true")
  runApplication<Application>(*args)
}

fun hashMessage(message: String) =
    MessageDigest.getInstance("SHA-256").digest(message.toByteArray()).joinToString("") {
      "%02x".format(it)
    }
