package nz.govt.eop.hilltop_crawler.config

import jakarta.annotation.PostConstruct
import java.time.Duration
import nz.govt.eop.hilltop_crawler.worker.WorkerTaskCreator
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.TaskScheduler

@Configuration
class FetchTasksConfig(val taskScheduler: TaskScheduler, val taskCreator: WorkerTaskCreator) {

  @PostConstruct
  fun startTasksProcessors() {
    println("Starting tasks")
    (1..10).forEach { id ->
      taskScheduler.scheduleWithFixedDelay(
          { taskCreator.processQueuedTasks(id) }, Duration.ofSeconds(1))
    }
  }
}
