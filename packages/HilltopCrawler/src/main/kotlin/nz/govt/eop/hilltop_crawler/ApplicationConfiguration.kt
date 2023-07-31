package nz.govt.eop.hilltop_crawler

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "crawler")
data class ApplicationConfiguration(val topicReplicas: Int)
