package nz.govt.eop.config

import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.scheduling.annotation.EnableScheduling

@Profile("!test") @Configuration @EnableScheduling class SchedulingConfiguration {}
