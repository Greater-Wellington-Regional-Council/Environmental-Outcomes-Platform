package nz.govt.eop.config

import javax.sql.DataSource
import net.javacrumbs.shedlock.core.LockProvider
import net.javacrumbs.shedlock.provider.jdbctemplate.JdbcTemplateLockProvider
import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.scheduling.annotation.EnableScheduling

@Profile("!test")
@Configuration
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "60m")
class SchedulingConfiguration {

  @Bean
  fun lockProvider(dataSource: DataSource): LockProvider? {
    return JdbcTemplateLockProvider(
        JdbcTemplateLockProvider.Configuration.builder()
            .withJdbcTemplate(JdbcTemplate(dataSource))
            .usingDbTime()
            .build())
  }
}
