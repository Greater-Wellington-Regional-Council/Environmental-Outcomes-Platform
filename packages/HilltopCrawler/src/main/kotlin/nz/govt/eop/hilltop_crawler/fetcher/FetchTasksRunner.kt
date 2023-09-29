package nz.govt.eop.hilltop_crawler.fetcher

import jakarta.annotation.PostConstruct
import java.time.Duration
import mu.KotlinLogging
import org.springframework.scheduling.TaskScheduler
import org.springframework.stereotype.Component

private const val TASKS_TO_RUN = 10

/**
 * A class responsible for running fetch tasks using a FetchTaskProcessor.
 *
 * Seperated from the processor so that each task processed runs in its own transaction.
 */
@Component
class FetchTasksRunner(val taskScheduler: TaskScheduler, val processor: FetchTaskProcessor) {

  private final val logger = KotlinLogging.logger {}

  /**
   * Uses springs task scheduler abstraction to effectively start a set of worker threads that will
   * process tasks from the Hilltop queue.
   *
   * When a thread starts working, it will process items from the DB queue until there is nothing
   * left, when it will stop.
   */
  @PostConstruct
  fun startTasks() {
    logger.info { "Starting " }
    (1..TASKS_TO_RUN).forEach { id ->
      taskScheduler.scheduleWithFixedDelay({ processTasks(id) }, Duration.ofSeconds(10000))
    }
  }

  fun processTasks(id: Int) {
    while (true) {
      try {
        val hadWorkToDo = processor.runNextTask()
        if (!hadWorkToDo) {
          return
        } else {
          Thread.yield()
        }
      } catch (e: InterruptedException) {
        return
      }
    }
  }
}
