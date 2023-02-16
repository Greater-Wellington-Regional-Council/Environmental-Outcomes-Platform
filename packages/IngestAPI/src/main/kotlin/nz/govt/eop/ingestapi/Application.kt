package nz.govt.eop.ingestapi

import java.nio.file.Files
import java.util.Base64
import kotlin.io.path.pathString
import kotlin.io.path.writeBytes
import org.apache.kafka.clients.admin.NewTopic
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.kafka.config.TopicBuilder

@SpringBootApplication
class Application {

  @Bean
  fun createWaterAllocationTopic(
      @Value("\${ingestApi.topicReplicas}") topicReplicas: Int
  ): NewTopic {
    return TopicBuilder.name(WATER_ALLOCATION_TOPIC_NAME)
        .partitions(4)
        .replicas(topicReplicas)
        .build()
  }
}

private const val ENV_CONFIG_KEYSTORE_CONTENT = "CONFIG_KEYSTORE_CONTENT"
private const val PROP_CONFIG_KEYSTORE_PATH = "CONFIG_KEYSTORE_PATH"

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
