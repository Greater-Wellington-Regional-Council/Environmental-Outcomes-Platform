package nz.govt.eop.utils

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "provide-a-prefix")
class UrlBasedDataSources<T : UrlBasedDataSources.Source> {
  lateinit var sources: List<T>

  open class Source {
    lateinit var name: String
    lateinit var urls: List<String>
  }
}
