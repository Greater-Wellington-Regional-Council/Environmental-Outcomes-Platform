package nz.govt.eop.ingestapi

import java.time.Instant
import mu.KotlinLogging
import mu.withLoggingContext
import org.springframework.http.MediaType
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

data class WaterAllocation(val areaId: String, val amount: Int)

data class WaterAllocationsRequestBody(
    val ingestId: String,
    val allocations: List<WaterAllocation>
)

data class IngestResponse(val ingestId: String, val receivedAt: String, val recordsIngested: Int)

@RestController
class Controller(private val producer: Producer) {

  private val logger = KotlinLogging.logger {}

  @PostMapping("/water-allocations", produces = [MediaType.APPLICATION_JSON_VALUE])
  fun waterAllocations(
      @AuthenticationPrincipal apiUser: UserDetails,
      @RequestBody requestBody: WaterAllocationsRequestBody
  ): IngestResponse {

    val receivedAt = Instant.now().toString()

    withLoggingContext("ingestId" to requestBody.ingestId) {
      logger.info { "Recieved ${requestBody.allocations.size} allocations" }
      producer.produce(requestBody.allocations, requestBody.ingestId, receivedAt)
      logger.info { "Ingested ${requestBody.allocations.size} allocations" }
    }

    return IngestResponse(
        ingestId = requestBody.ingestId,
        receivedAt = receivedAt,
        recordsIngested = requestBody.allocations.size,
    )
  }
}
