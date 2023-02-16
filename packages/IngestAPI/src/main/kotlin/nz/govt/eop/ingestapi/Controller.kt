package nz.govt.eop.ingestapi

import java.time.Instant
import java.util.UUID
import mu.KotlinLogging
import org.springframework.http.MediaType
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

data class IngestResponse(val ingestId: String, val receivedAt: String, val recordsIngested: Int)

data class WaterAllocation(val id: String, val amount: Int)

@RestController
class Controller(private val producer: Producer) {

  private val logger = KotlinLogging.logger {}

  @PostMapping("/water-allocations", produces = [MediaType.APPLICATION_JSON_VALUE])
  fun waterAllocations(
      @AuthenticationPrincipal apiUser: UserDetails,
      @RequestBody allocations: List<WaterAllocation>
  ): IngestResponse {

    val ingestId = UUID.randomUUID().toString()
    val receivedAt = Instant.now().toString()

    logger.info { "Recieved ${allocations.size} allocations" }
    producer.produce(allocations, ingestId, receivedAt)
    logger.info { "Ingested ${allocations.size} allocations" }

    return IngestResponse(
        ingestId = ingestId,
        receivedAt = receivedAt,
        recordsIngested = allocations.size,
    )
  }
}
