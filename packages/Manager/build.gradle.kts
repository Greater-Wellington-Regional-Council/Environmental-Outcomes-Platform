import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.jooq.meta.jaxb.ForcedType
import org.springframework.core.io.FileSystemResource
import org.springframework.jdbc.datasource.SingleConnectionDataSource
import org.springframework.jdbc.datasource.init.ScriptUtils.*

plugins {
  id("org.springframework.boot") version "3.1.4"
  id("io.spring.dependency-management") version "1.1.3"

  kotlin("jvm") version "1.9.10"
  kotlin("plugin.spring") version "1.9.20"

  id("com.diffplug.spotless") version "6.18.0"
  id("com.adarshr.test-logger") version "4.0.0"

  id("org.flywaydb.flyway") version "9.22.3"
  id("nu.studer.jooq") version "8.0"
}

group = "nz.govt.eop"

version = "0.0.1-SNAPSHOT"

java.sourceCompatibility = JavaVersion.VERSION_17

repositories { mavenCentral() }

buildscript {
  repositories { mavenCentral() }
  dependencies {
    "classpath"(group = "org.springframework", name = "spring-jdbc", version = "6.0.12")
    "classpath"(group = "org.postgresql", name = "postgresql", version = "42.6.0")
  }
}

ext["jooq.version"] = jooq.version.get()

dependencies {
  jooqGenerator("org.postgresql:postgresql")
  // @see https://github.com/etiennestuder/gradle-jooq-plugin/issues/209#issuecomment-1056578392
  jooqGenerator("jakarta.xml.bind:jakarta.xml.bind-api:3.0.1")

  runtimeOnly("org.postgresql:postgresql")
  runtimeOnly("net.logstash.logback:logstash-logback-encoder:7.3")

  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-actuator")
  implementation("org.springframework.boot:spring-boot-starter-jdbc")
  implementation("org.springframework.boot:spring-boot-starter-jooq")
  implementation("org.springframework.kafka:spring-kafka")
  implementation("org.apache.kafka:kafka-streams")
  implementation("io.micrometer:micrometer-tracing-bridge-brave")
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-xml")
  implementation("org.flywaydb:flyway-core")
  implementation("io.github.microutils:kotlin-logging-jvm:3.0.5")
  implementation("de.grundid.opendatalab:geojson-jackson:1.14")
  implementation("net.javacrumbs.shedlock:shedlock-spring:5.2.0")
  implementation("net.javacrumbs.shedlock:shedlock-provider-jdbc-template:5.9.0")
  implementation("net.postgis:postgis-jdbc:2021.1.0")

  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("io.kotest:kotest-assertions-core:5.5.5")
  testImplementation("org.springframework.kafka:spring-kafka-test")
  testImplementation("org.awaitility:awaitility-kotlin:4.2.0")
}

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
    // We specify the target directly here to avoid having the plugin depend on
    // generated sources, which was forcing Flyway to run before the SQL had been
    // formatted, which then confused flyway the next time it ran.
    target("src/main/kotlin/**/*.kt", "src/test/kotlin/**/*.kt")
    ktfmt()
  }
  kotlinGradle { ktfmt() }
}

val dbConfig =
    mapOf(
        "devUrl" to
            "jdbc:postgresql://${System.getenv("CONFIG_DATABASE_HOST") ?: "localhost"}:5432/eop_dev",
        "testUrl" to
            "jdbc:postgresql://${System.getenv("CONFIG_DATABASE_HOST") ?: "localhost"}:5432/eop_test",
        "user" to "postgres",
        "password" to "password")

flyway {
  url = dbConfig["testUrl"]
  user = dbConfig["user"]
  password = dbConfig["password"]
  schemas = arrayOf("public")
  locations = arrayOf("filesystem:./src/**/resources/db/migration")
}

jooq {
  configurations {
    create("main") {
      jooqConfiguration.apply {
        logging = org.jooq.meta.jaxb.Logging.WARN
        jdbc.apply {
          driver = "org.postgresql.Driver"
          url = dbConfig["testUrl"]
          user = dbConfig["user"]
          password = dbConfig["password"]
        }
        generator.apply {
          name = "org.jooq.codegen.KotlinGenerator"
          database.apply {
            name = "org.jooq.meta.postgres.PostgresDatabase"
            inputSchema = "public"
            forcedTypes =
                listOf(
                    ForcedType().apply {
                      userType = "net.postgis.jdbc.geometry.Geometry"
                      binding = "nz.govt.eop.si.jooq.PostgisGeometryBinding"
                      includeExpression = ".*"
                      includeTypes = "GEOMETRY"
                    },
                    ForcedType().apply {
                      userType = "nz.govt.eop.si.jooq.TakeType"
                      isEnumConverter = true
                      includeExpression = ".*take_type"
                    },
                    ForcedType().apply {
                      userType = "nz.govt.eop.si.jooq.ManagementUnitType"
                      isEnumConverter = true
                      includeExpression = ".*management_unit_type"
                    })
            excludes =
                "st_.*|spatial_ref_sys|geography_columns|geometry_columns|flyway_schema_history"
          }
          generate.apply {
            isGlobalTableReferences = false
            isRoutines = false
            isUdts = false
            isIndexes = false
            isKeys = false
            isTables = false
            isSpatialTypes = false

            isPojosAsKotlinDataClasses = true
            isImmutablePojos = true
          }
          target.apply { packageName = "nz.govt.eop.si.jooq" }
          strategy.name = "org.jooq.codegen.DefaultGeneratorStrategy"
        }
      }
    }
  }
}

tasks.named<nu.studer.gradle.jooq.JooqGenerate>("generateJooq") {
  dependsOn("flywayMigrate")

  // declare Flyway migration scripts as inputs on the jOOQ task
  inputs
      .files(fileTree("src/**/resources/db/migration"))
      .withPropertyName("migrations")
      .withPathSensitivity(PathSensitivity.RELATIVE)

  allInputsDeclared.set(true)
}

testlogger {
  showStandardStreams = true
  showPassedStandardStreams = false
  showSkippedStandardStreams = false
  showFailedStandardStreams = true
}

tasks.register("loadSampleData") {
  dependsOn("flywayMigrate")
  doLast {
    println("Loading Sample Data")
    SingleConnectionDataSource(
            dbConfig["devUrl"]!!, dbConfig["user"]!!, dbConfig["password"]!!, true)
        .let {
          it.connection.use { connection ->
            executeSqlScript(connection, FileSystemResource("./sample-data/allocation_data.sql"))
            executeSqlScript(connection, FileSystemResource("./sample-data/observation_data.sql"))
          }
        }
  }
}

tasks.register("refreshSampleData") {
  dependsOn("flywayMigrate")
  doLast {
    println("Refresh Sample Data Dates")

    SingleConnectionDataSource(
            dbConfig["devUrl"]!!, dbConfig["user"]!!, dbConfig["password"]!!, true)
        .let {
          it.connection.use { connection ->
            executeSqlScript(
                connection, FileSystemResource("./sample-data/update_observation_dates.sql"))
          }
        }
  }
}
