package nz.govt.eop.hilltop_crawler.worker

import mu.KotlinLogging
import org.springframework.stereotype.Component

/** This class is responsible for creating worker tasks that will process the queued tasks. */
@Component
class WorkerTaskCreator(val scheduler: HilltopJobProcessor) {
  private val logger = KotlinLogging.logger {}

  fun processQueuedTasks(id: Int) {
    do {
      try {
        val hadWorkToDo = scheduler.runNextQueuedTask()
        if (!hadWorkToDo) {
          return
        } else {
          Thread.yield()
        }
      } catch (e: InterruptedException) {
        return
      }
    } while (true)
  }
}
