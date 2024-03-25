package nz.govt.eop.hilltop_crawler

import com.fasterxml.jackson.core.StreamReadConstraints
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties(ApplicationConfiguration::class)
class Application {}

fun main(args: Array<String>) {
  System.setProperty("com.sun.security.enableAIAcaIssuers", "true")

  StreamReadConstraints.overrideDefaultStreamReadConstraints(
      StreamReadConstraints.builder().maxStringLength(50_000_000).build())

  runApplication<Application>(*args)
}
