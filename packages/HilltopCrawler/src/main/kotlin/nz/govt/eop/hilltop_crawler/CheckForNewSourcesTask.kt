package nz.govt.eop.hilltop_crawler

import nz.govt.eop.hilltop_crawler.api.requests.buildSiteListUrl
import nz.govt.eop.hilltop_crawler.db.DB
import nz.govt.eop.hilltop_crawler.worker.HilltopMessageType.SITES_LIST
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

/**
 * This task is responsible for triggering the first fetch task for each source stored in the DB.
 *
 * It runs each hour, and will create the initial fetch task for each source found. This relies on
 * that first fetch task only being run once, and the result of the tasks being idempotent.
 */
@Component
class CheckForNewSourcesTask(val db: DB) {

  @Scheduled(fixedDelay = 60_000 * 60)
  fun triggerSourcesTasks() {
    val sources = db.listSources()

    sources.forEach {
      db.createFetchTask(DB.HilltopFetchTaskCreate(it.id, SITES_LIST, buildSiteListUrl(it.htsUrl)))
    }
  }
}
