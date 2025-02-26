import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  id("org.springframework.boot") version "3.4.2"
  id("io.spring.dependency-management") version "1.1.7"
  id("com.diffplug.spotless") version "7.0.2"
  id("org.flywaydb.flyway") version "11.2.0"
  id("com.adarshr.test-logger") version "4.0.0"
  kotlin("jvm") version "2.1.10"
  kotlin("plugin.spring") version "2.1.10"
}

buildscript {
  repositories { mavenCentral() }
  dependencies { classpath("org.flywaydb:flyway-database-postgresql:11.2.0") }
}

group = "nz.govt.eop"

version = "0.0.1-SNAPSHOT"

java.sourceCompatibility = JavaVersion.VERSION_17

repositories { mavenCentral() }

dependencies {
  developmentOnly("org.springframework.boot:spring-boot-devtools")

  runtimeOnly("org.postgresql:postgresql")
  runtimeOnly("net.logstash.logback:logstash-logback-encoder:8.0")

  implementation("org.springframework.boot:spring-boot-starter-actuator")
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-jdbc")

  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-xml")
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
  implementation("org.springframework.kafka:spring-kafka")
  implementation("org.flywaydb:flyway-core:11.2.0")
  implementation("org.flywaydb:flyway-database-postgresql:11.2.0")
  implementation("io.github.microutils:kotlin-logging-jvm:3.0.5")
  implementation("org.apache.kafka:kafka-streams")
  implementation("com.bucket4j:bucket4j-core:8.10.1")

  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("org.springframework.kafka:spring-kafka-test")
  testImplementation("io.kotest:kotest-assertions-core:5.9.1")
  testImplementation("io.kotest:kotest-assertions-json:5.9.1")
  testImplementation("org.mockito.kotlin:mockito-kotlin:5.4.0")
}

// Don't repackage build in a "-plain" Jar
tasks.getByName<Jar>("jar") { enabled = false }

tasks.withType<KotlinCompile> {
  kotlinOptions {
    freeCompilerArgs = listOf("-Xjsr305=strict")
    jvmTarget = "17"
  }
}

tasks.withType<Test> {
  useJUnitPlatform()
  this.testLogging { this.showStandardStreams = true }
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
