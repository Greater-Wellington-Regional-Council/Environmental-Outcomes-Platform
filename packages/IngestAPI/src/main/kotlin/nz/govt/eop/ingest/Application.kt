package nz.govt.eop.ingest

import java.nio.file.Files
import java.util.Base64
import kotlin.io.path.pathString
import kotlin.io.path.writeBytes
import org.apache.kafka.clients.admin.NewTopic
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Profile
import org.springframework.kafka.config.TopicBuilder

private const val ENV_CONFIG_KEYSTORE_CONTENT = "CONFIG_KEYSTORE_CONTENT"
private const val PROP_CONFIG_KEYSTORE_PATH = "CONFIG_KEYSTORE_PATH"

@SpringBootApplication
@EnableConfigurationProperties(ApplicationConfiguration::class)
class Application {

  // Topics are created in test via EmbeddedKafka config. This helps avoid race
  // conditions and retries when EmbeddedKafka is not be ready, and speeds up boot.
  @Profile("!test")
  @Bean
  fun createWaterAllocationTopic(ingestApiConfiguration: ApplicationConfiguration): NewTopic {
    return TopicBuilder.name(WATER_ALLOCATION_TOPIC_NAME)
        .partitions(1)
        .replicas(ingestApiConfiguration.topicReplicas)
        .build()
  }
}

fun main(args: Array<String>) {
  if (System.getenv(ENV_CONFIG_KEYSTORE_CONTENT) != null) {
    storeKeystoreFromEnvironment()
  }
  runApplication<Application>(*args)
}

/**
 * This function takes a Base64 encoded keystore from the environment var
 * ENV_CONFIG_KEYSTORE_CONTENT, saves it as a temp file and then stores that file name in the system
 * property PROP_CONFIG_KEYSTORE_PATH.
 *
 * This is a workaround for the fact that JVMs for SSL require the keystore to be stored on the file
 * system. And for deploying via ECS there is no way of making a file available that isn't baked
 * into the container image. In this case we can just pass the Keystore in via an environment
 * variable and that will become available as a file.
 */
private fun storeKeystoreFromEnvironment() {
  val keyStoreContent = System.getenv(ENV_CONFIG_KEYSTORE_CONTENT)
  val keyStoreFile = Files.createTempFile("keystore", ".jks")
  val keyStoreBytes = Base64.getDecoder().decode(keyStoreContent)

  keyStoreFile.writeBytes(keyStoreBytes)

  System.setProperty(PROP_CONFIG_KEYSTORE_PATH, keyStoreFile.pathString)
}
