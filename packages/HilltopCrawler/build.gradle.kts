import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  id("org.springframework.boot") version "3.1.3"
  id("io.spring.dependency-management") version "1.1.3"
  kotlin("jvm") version "1.8.22"
  kotlin("plugin.spring") version "1.8.22"
  id("com.diffplug.spotless") version "6.18.0"
  id("org.flywaydb.flyway") version "9.1.6"
}

group = "nz.govt.eop"

version = "0.0.1-SNAPSHOT"

java.sourceCompatibility = JavaVersion.VERSION_17

repositories { mavenCentral() }

dependencies {
  developmentOnly("org.springframework.boot:spring-boot-devtools")

  runtimeOnly("org.postgresql:postgresql")
  runtimeOnly("net.logstash.logback:logstash-logback-encoder:7.3")

  implementation("org.springframework.boot:spring-boot-starter-actuator")
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-jdbc")

  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-xml")
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
  implementation("org.springframework.kafka:spring-kafka")
  implementation("org.apache.kafka:kafka-streams")
  implementation("org.flywaydb:flyway-core")
  implementation("com.bucket4j:bucket4j-core:8.3.0")
  implementation("io.github.microutils:kotlin-logging-jvm:2.1.23")

  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("org.springframework.kafka:spring-kafka-test")
  testImplementation("io.kotest:kotest-assertions-core:5.7.2")
  testImplementation("io.kotest:kotest-assertions-json:5.7.2")
}

// Don't repackage build in a "-plain" Jar
tasks.getByName<Jar>("jar") { enabled = false }

tasks.withType<KotlinCompile> {
  kotlinOptions {
    freeCompilerArgs = listOf("-Xjsr305=strict")
    jvmTarget = "17"
  }
}

tasks.withType<Test> { useJUnitPlatform() }

configure<com.diffplug.gradle.spotless.SpotlessExtension> {
  kotlin {
    targetExclude("build/generated-src/**/*.*")
    ktfmt()
  }
  kotlinGradle { ktfmt() }
}

val dbConfig =
    mapOf(
        "url" to
            "jdbc:postgresql://${System.getenv("CONFIG_DATABASE_HOST") ?: "localhost"}:5432/eop_test",
        "user" to "postgres",
        "password" to "password")

flyway {
  url = dbConfig["url"]
  user = dbConfig["user"]
  password = dbConfig["password"]
  schemas = arrayOf("hilltop_crawler")
  locations = arrayOf("filesystem:./src/main/resources/db/migration")
}
