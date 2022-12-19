package nz.govt.eop

import java.text.DecimalFormat
import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class MemoryLogger {

  private val logger = KotlinLogging.logger {}

  @Scheduled(fixedDelay = 20, timeUnit = TimeUnit.SECONDS)
  fun updateWhaituaBoundaries() {

    val freeMemory = Runtime.getRuntime().freeMemory()
    val maxMemory = Runtime.getRuntime().maxMemory()
    val totalMemory = Runtime.getRuntime().totalMemory()
    logger.info {
      "Memory stats : ${readableFileSize(freeMemory)} / ${readableFileSize( totalMemory)} / ${readableFileSize(maxMemory)}"
    }
  }

  fun readableFileSize(size: Long): String? {
    if (size <= 0) return "0"
    val units = arrayOf("B", "kB", "MB", "GB", "TB")
    val digitGroups = (Math.log10(size.toDouble()) / Math.log10(1024.0)).toInt()
    return DecimalFormat("#,##0.#").format(size / Math.pow(1024.0, digitGroups.toDouble())) +
        " " +
        units[digitGroups]
  }
}
