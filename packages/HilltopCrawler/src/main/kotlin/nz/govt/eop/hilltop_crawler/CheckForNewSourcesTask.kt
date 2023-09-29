package nz.govt.eop.hilltop_crawler

import java.util.concurrent.TimeUnit
import nz.govt.eop.hilltop_crawler.api.requests.buildSiteListUrl
import nz.govt.eop.hilltop_crawler.db.DB
import nz.govt.eop.hilltop_crawler.fetcher.HilltopMessageType.SITES_LIST
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

/**
 * This task is responsible for triggering the first fetch task for each source stored in the DB.
 *
 * It makes sure any new rows added to the DB will start to be pulled from within an hour.
 *
 * Each time it runs, it will create the initial fetch task for each source found in the DB. This
 * relies on how the code is structured to ensure that the fetch task will only be created if it
 * does not already exist.
 */
@Component
class CheckForNewSourcesTask(val db: DB) {

  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.HOURS)
  fun triggerSourcesTasks() {
    val sources = db.listSources()

    sources.forEach {
      db.createFetchTask(DB.HilltopFetchTaskCreate(it.id, SITES_LIST, buildSiteListUrl(it.htsUrl)))
    }
  }
}
