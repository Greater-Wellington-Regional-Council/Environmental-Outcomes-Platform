package nz.govt.eop.config

import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfiguration : WebMvcConfigurer {

  override fun addCorsMappings(registry: CorsRegistry) {
    configureCors(registry, "/**") // General API endpoints
    configureCors(registry, "/actuator/**") // Actuator endpoints
  }

  private fun configureCors(registry: CorsRegistry, pathPattern: String) {
    registry
        .addMapping(pathPattern)
        .allowedOriginPatterns(
            "http://localhost:[*]",
            "https://*.amplifyapp.com",
            "https://*.gw-eop-dev.tech",
            "https://*.gw-eop-stage.tech",
            "https://*.eop.gw.govt.nz")
        .allowedMethods(HttpMethod.GET.toString(), HttpMethod.POST.toString())
  }
}
