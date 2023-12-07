import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  id("org.springframework.boot") version "3.2.0"
  id("io.spring.dependency-management") version "1.1.4"
  id("com.diffplug.spotless") version "6.23.3"
  id("com.adarshr.test-logger") version "4.0.0"
  kotlin("jvm") version "1.7.22"
  kotlin("plugin.spring") version "1.7.22"
  kotlin("kapt") version "1.7.22"
}

group = "nz.govt.eop"

version = "0.0.1-SNAPSHOT"

java.sourceCompatibility = JavaVersion.VERSION_17

repositories { mavenCentral() }

dependencies {
  developmentOnly("org.springframework.boot:spring-boot-devtools")

  runtimeOnly("org.springframework.boot:spring-boot-devtools")
  runtimeOnly("net.logstash.logback:logstash-logback-encoder:7.3")

  implementation("org.springframework.boot:spring-boot-starter-actuator")
  implementation("org.springframework.boot:spring-boot-starter-security")
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation("io.micrometer:micrometer-tracing-bridge-brave")
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
  implementation("org.springframework.kafka:spring-kafka")
  implementation("io.github.microutils:kotlin-logging-jvm:3.0.5")

  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("org.springframework.kafka:spring-kafka-test")
  testImplementation("org.springframework.security:spring-security-test")
  testImplementation("io.kotest:kotest-assertions-core:5.5.5")

  kapt("org.springframework.boot:spring-boot-configuration-processor")
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
  kotlin { ktfmt() }
  kotlinGradle { ktfmt() }
}

testlogger {
  showStandardStreams = true
  showPassedStandardStreams = false
  showSkippedStandardStreams = false
  showFailedStandardStreams = true
}
