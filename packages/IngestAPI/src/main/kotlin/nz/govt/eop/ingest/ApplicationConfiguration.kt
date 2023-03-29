package nz.govt.eop.ingest

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "ingest")
data class ApplicationConfiguration(val topicReplicas: Int, val users: List<User>)

data class User(val username: String, val token: String)
