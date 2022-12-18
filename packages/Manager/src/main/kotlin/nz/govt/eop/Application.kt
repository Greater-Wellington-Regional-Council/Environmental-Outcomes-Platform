package nz.govt.eop

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.cache.annotation.EnableCaching
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestTemplate

@EnableCaching
@SpringBootApplication
class Application() {

  @Bean fun restTemplate(): RestTemplate = RestTemplateBuilder().build()
}

fun main(args: Array<String>) {
  runApplication<Application>(*args)
}
