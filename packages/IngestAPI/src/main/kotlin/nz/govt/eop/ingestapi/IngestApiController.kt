package nz.govt.eop.ingestapi

import java.time.Instant
import java.util.UUID
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.GetMapping

data class IngestResponse(val receivedAt: String, val ingestID: String)

@RestController
class IngestAPIController {
    @GetMapping("/allocations", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun allocations(): IngestResponse {
        return IngestResponse(
            receivedAt = Instant.now().toString(),
            ingestID = UUID.randomUUID().toString()
        )
    }
}
