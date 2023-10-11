package nz.govt.eop.hilltop_crawler

import nz.govt.eop.hilltop_crawler.fetcher.HilltopMessageClient
import org.mockito.Mockito
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean

@TestConfiguration
class HilltopCrawlerTestConfiguration {

  @Bean
  fun hilltopMessageClient(): HilltopMessageClient = Mockito.mock(HilltopMessageClient::class.java)
}
