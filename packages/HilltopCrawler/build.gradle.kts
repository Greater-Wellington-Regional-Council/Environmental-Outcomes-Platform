import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
  id("org.springframework.boot") version "3.5.16"
  id("io.spring.dependency-management") version "1.1.7"
  id("com.diffplug.spotless") version "8.8.0"
  id("com.github.ben-manes.versions") version "0.52.0"
  id("org.flywaydb.flyway") version "11.20.0"
  id("com.adarshr.test-logger") version "4.0.0"
  kotlin("jvm") version "2.4.10"
  kotlin("plugin.spring") version "2.4.10"
}

buildscript {
  repositories { mavenCentral() }
  dependencies { classpath("org.flywaydb:flyway-database-postgresql:11.20.0") }
}

group = "nz.govt.eop"

version = "0.0.1-SNAPSHOT"

java { toolchain { languageVersion = JavaLanguageVersion.of(21) } }

repositories { mavenCentral() }

dependencies {
  developmentOnly("org.springframework.boot:spring-boot-devtools")

  runtimeOnly("org.postgresql:postgresql")
  runtimeOnly("net.logstash.logback:logstash-logback-encoder:9.0")

  implementation("org.springframework.boot:spring-boot-starter-actuator")
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-jdbc")

  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-xml")
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
  implementation("org.springframework.kafka:spring-kafka")
  implementation("org.flywaydb:flyway-core:11.20.0")
  implementation("org.flywaydb:flyway-database-postgresql:11.20.0")
  implementation("io.github.microutils:kotlin-logging-jvm:3.0.5")
  implementation("org.apache.kafka:kafka-streams")
  implementation("com.bucket4j:bucket4j-core:8.10.1")

  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("org.springframework.kafka:spring-kafka-test")
  testImplementation("io.kotest:kotest-assertions-core:6.2.3")
  testImplementation("io.kotest:kotest-assertions-json:6.2.3")
  testImplementation("org.mockito.kotlin:mockito-kotlin:6.3.0")
}

// Don't repackage build in a "-plain" Jar
tasks.getByName<Jar>("jar") { enabled = false }

kotlin {
  compilerOptions {
    freeCompilerArgs.add("-Xjsr305=strict")
    jvmTarget = JvmTarget.JVM_21
  }
}

tasks.withType<Test> {
  useJUnitPlatform()
  this.testLogging { this.showStandardStreams = true }
}

fun isNonStable(version: String): Boolean {
  val stableKeyword = listOf("RELEASE", "FINAL", "GA").any { version.uppercase().contains(it) }

  val stablePattern = Regex("^[0-9,.v-]+(-r)?$")

  return !stableKeyword && !stablePattern.matches(version)
}

tasks.named<com.github.benmanes.gradle.versions.updates.DependencyUpdatesTask>(
    "dependencyUpdates"
) {
  rejectVersionIf { isNonStable(candidate.version) && !isNonStable(currentVersion) }
}

configure<com.diffplug.gradle.spotless.SpotlessExtension> {
  kotlin {
    targetExclude("build/generated-src/**/*.*")
    ktfmt()
  }
  kotlinGradle { ktfmt() }
}

testlogger {
  showStandardStreams = true
  showPassedStandardStreams = false
  showSkippedStandardStreams = false
  showFailedStandardStreams = true
}
