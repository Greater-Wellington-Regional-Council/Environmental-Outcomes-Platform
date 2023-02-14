package nz.govt.eop.ingestapi

import java.time.Instant
import java.util.UUID
import mu.KotlinLogging
import org.springframework.http.MediaType
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

data class IngestResponse(val receivedAt: String, val ingestID: String)

@RestController
class Controller(val producer: Producer) {

  private val logger = KotlinLogging.logger {}

  @GetMapping("/allocations", produces = [MediaType.APPLICATION_JSON_VALUE])
  fun allocations(@AuthenticationPrincipal apiUser: UserDetails): IngestResponse {
    // producer.produce("The message")
    logger.info { "Ingest called by ${apiUser.username}" }
    return IngestResponse(
        receivedAt = Instant.now().toString(),
        ingestID = UUID.randomUUID().toString(),
    )
  }
}
