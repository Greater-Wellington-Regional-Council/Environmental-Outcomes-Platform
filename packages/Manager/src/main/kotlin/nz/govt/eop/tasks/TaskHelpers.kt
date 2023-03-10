package nz.govt.eop.tasks

import mu.KLogger

fun startTaskMessage(name: String) = "Start Task ${name}"

fun endTaskMessage(name: String) = "End Task ${name}"

fun startTaskRefreshMessage(name: String) = "Start Task refresh ${name}"

fun endTaskRefreshMessage(name: String) = "End Task refresh ${name}"

fun processDataRefresh(
    logger: KLogger,
    taskName: String,
    checkFunc: () -> Boolean,
    refreshFunc: () -> Unit
) {
  logger.debug { startTaskMessage(taskName) }
  val needsRefresh = checkFunc()
  if (needsRefresh) {
    logger.info { startTaskRefreshMessage(taskName) }
    refreshFunc()
    logger.info { endTaskRefreshMessage(taskName) }
  }
  logger.debug { endTaskMessage(taskName) }
}
