package nz.govt.eop

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.cache.annotation.EnableCaching
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestTemplate
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@EnableCaching
@SpringBootApplication
class Application() {

  @Bean fun restTemplate(): RestTemplate = RestTemplateBuilder().build()

  @Bean
  fun corsConfigurer(): WebMvcConfigurer {
    return object : WebMvcConfigurer {
      override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**").allowedOriginPatterns("http://localhost:[*]")
      }
    }
  }
}

fun main(args: Array<String>) {
  runApplication<Application>(*args)
}
