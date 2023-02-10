package nz.govt.eop.ingestapi

import java.time.Instant
import java.util.UUID
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

data class IngestResponse(val receivedAt: String, val ingestID: String)

@RestController
class Controller(val producer: Producer) {
  @GetMapping("/allocations", produces = [MediaType.APPLICATION_JSON_VALUE])
  fun allocations(): IngestResponse {
    return IngestResponse(
        receivedAt = Instant.now().toString(),
        ingestID = UUID.randomUUID().toString(),
    )
  }
}
