package nz.govt.eop.ingestapi

import java.nio.file.Files
import java.util.Base64
import kotlin.io.path.pathString
import kotlin.io.path.writeBytes
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication class Application

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