package nz.govt.eop.tasks

import java.util.concurrent.TimeUnit
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class WaterAllocationViewUpdater(val jdbcTemplate: JdbcTemplate) {

  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.HOURS)
  @SchedulerLock(name = "waterAllocationViewUpdater")
  @Transactional
  fun refresh() {
    jdbcTemplate.update(
        "SET ROLE materialized_views_role; REFRESH MATERIALIZED VIEW CONCURRENTLY water_allocation_and_usage_by_area;")
  }
}
