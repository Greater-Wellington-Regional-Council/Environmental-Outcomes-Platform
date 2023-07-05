package nz.govt.eop.messages

import java.time.Instant

data class HilltopDataMessage(
    val councilId: Int,
    val hilltopUrl: String,
    val type: String,
    val xml: String,
    val at: Instant
)
