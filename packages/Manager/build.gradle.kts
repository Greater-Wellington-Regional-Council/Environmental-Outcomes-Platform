import java.io.File
import java.io.FileReader
import java.nio.charset.StandardCharsets
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.jooq.meta.jaxb.ForcedType
import org.jooq.tools.csv.CSVReader
import org.springframework.core.io.FileSystemResource
import org.springframework.jdbc.datasource.SingleConnectionDataSource
import org.springframework.jdbc.datasource.init.ScriptUtils.*

plugins {
  id("org.springframework.boot") version "3.4.0"
  id("io.spring.dependency-management") version "1.1.7"
  id("com.diffplug.spotless") version "6.25.0"
  id("org.flywaydb.flyway") version "11.3.2"
  id("nu.studer.jooq") version "9.0"
  id("com.adarshr.test-logger") version "4.0.0"
  kotlin("jvm") version "2.1.0"
  kotlin("plugin.spring") version "2.1.0"
}

buildscript {
  repositories { mavenCentral() }
  dependencies {
    classpath("org.flywaydb:flyway-database-postgresql:11.3.2")
    classpath("org.springframework:spring-jdbc:6.2.3")
    classpath("org.postgresql:postgresql:42.6.2")
  }
}

group = "nz.govt.eop"

version = "0.0.1-SNAPSHOT"

java.sourceCompatibility = JavaVersion.VERSION_17

repositories { mavenCentral() }

ext["jooq.version"] = jooq.version.get()

dependencies {
  jooqGenerator("org.postgresql:postgresql")
  // @see https://github.com/etiennestuder/gradle-jooq-plugin/issues/209#issuecomment-1056578392
  jooqGenerator("jakarta.xml.bind:jakarta.xml.bind-api:3.0.1")

  runtimeOnly("org.postgresql:postgresql")
  runtimeOnly("net.logstash.logback:logstash-logback-encoder:8.0")

  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-actuator")
  implementation("org.springframework.boot:spring-boot-starter-jdbc")
  implementation("org.springframework.boot:spring-boot-starter-jooq")
  implementation("org.springframework.boot:spring-boot-starter-data-jpa")
  implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.7.0")
  implementation("org.springframework.boot:spring-boot-starter-webflux")
  implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0")

  implementation("org.springframework.kafka:spring-kafka")
  implementation("org.apache.kafka:kafka-streams")
  implementation("io.micrometer:micrometer-tracing-bridge-brave")
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-xml")
  implementation("org.flywaydb:flyway-core:11.3.2")
  implementation("org.flywaydb:flyway-database-postgresql:11.3.2")
  implementation("io.github.microutils:kotlin-logging-jvm:3.0.5")
  implementation("de.grundid.opendatalab:geojson-jackson:1.14")
  implementation("net.javacrumbs.shedlock:shedlock-spring:6.3.0")
  implementation("net.javacrumbs.shedlock:shedlock-provider-jdbc-template:6.3.0")
  implementation(dependencyNotation = "net.postgis:postgis-jdbc:2024.1.0")
  implementation("de.grundid.opendatalab:geojson-jackson:1.14")
  implementation("org.locationtech.jts:jts-core:1.20.0")
  implementation("com.opencsv:opencsv:5.9")
  implementation("io.github.resilience4j:resilience4j-spring-boot3:2.2.0")
  implementation("io.github.resilience4j:resilience4j-ratelimiter:2.2.0")
  implementation("com.github.ben-manes.caffeine:caffeine:3.1.8")

  implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
  implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactive:1.10.1")
  implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor:1.10.1")

  testImplementation("org.jetbrains.kotlin:kotlin-test")
  testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("io.kotest:kotest-runner-junit5:5.9.1")
  testImplementation("io.kotest:kotest-assertions-core:5.9.1")
  testImplementation("io.kotest:kotest-framework-engine:5.9.1")
  testImplementation("org.springframework.kafka:spring-kafka-test")
  testImplementation("org.awaitility:awaitility-kotlin:4.2.2")
  testImplementation("io.mockk:mockk:1.13.16")
  testImplementation("io.kotest.extensions:kotest-extensions-spring:1.3.0")
  testImplementation("org.mockito.kotlin:mockito-kotlin:5.4.0")
  testImplementation("com.squareup.okhttp3:mockwebserver:4.12.0")
}

tasks.getByName<Jar>("jar") { enabled = false }

tasks.withType<KotlinCompile> { compilerOptions { freeCompilerArgs = listOf("-Xjsr305=strict") } }

tasks.withType<Test> {
  useJUnitPlatform()
  this.testLogging { this.showStandardStreams = true }
}

configure<com.diffplug.gradle.spotless.SpotlessExtension> {
  kotlin {
    // We specify the target directly here to avoid having the plugin depend on
    // generated sources, which was forcing Flyway to run before the SQL had been
    // formatted, which then confused flyway the next time it ran.
    // TangataWhenuaSite.kt is causing issues with the formatter for now.
    target("src/main/kotlin/**/*.kt", "src/test/kotlin/**/*.kt")
    targetExclude("**/TangataWhenuaSite.kt")
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
        "password" to "password",
    )

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
                )
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
            dbConfig["devUrl"]!!,
            dbConfig["user"]!!,
            dbConfig["password"]!!,
            true,
        )
        .let {
          it.connection.use { connection ->
            executeSqlScript(connection, FileSystemResource("./sample-data/allocation_data.sql"))
            executeSqlScript(connection, FileSystemResource("./sample-data/observation_data.sql"))
          }
        }
  }
}

// import org.springframework.core.io.FileSystemResource
//        import org.springframework.jdbc.datasource.SingleConnectionDataSource
//        import org.springframework.jdbc.datasource.init.ScriptUtils.executeSqlScript
//        import java.io.File
//
// val dbConfig = mapOf(
//  "devUrl" to "jdbc:postgresql://${System.getenv("CONFIG_DATABASE_HOST") ?:
// "localhost"}:5432/eop_dev",
//  "user" to "postgres",
//  "password" to "password"
// )

tasks.register("loadSampleDataFromCSV") {
  dependsOn("flywayMigrate")
  doLast {
    println("Loading Sample Data from CSV")

    val csvFile = File("./sample-data/water_allocations_202412122223.csv")
    val sqlFile = File("./sample-data/allocation_data.sql")

    CSVReader(FileReader(csvFile, StandardCharsets.UTF_8)).use { reader ->
      sqlFile.printWriter(StandardCharsets.UTF_8).use { writer ->
        writer.println("DELETE FROM water_allocations;")

        reader.readAll().drop(1).forEach { columns ->
          val effectiveTo = if (columns[14].isEmpty()) "NULL" else "'${columns[14]}'"
          val sql =
              """
                        INSERT INTO water_allocations (
                            id, area_id, allocation_plan, ingest_id, created_at, updated_at, source_id, consent_id, status, is_metered, allocation_daily, allocation_yearly, meters, effective_from, effective_to, category
                        ) VALUES (
                            ${columns[0]}, '${columns[1]}', ${columns[2]}, '${columns[3]}', '${columns[4]}', '${columns[5]}', '${columns[6]}', '${columns[7]}', '${columns[8]}', ${columns[9]}, ${columns[10]}, ${columns[11]}, '${columns[12]}', '${columns[13]}', $effectiveTo, '${columns[15]}'
                        );
                    """
                  .trimIndent()
          writer.println(sql)
        }
      }
    }

    SingleConnectionDataSource(
            dbConfig["devUrl"]!!, dbConfig["user"]!!, dbConfig["password"]!!, true)
        .let {
          it.connection.use { connection ->
            executeSqlScript(connection, FileSystemResource(sqlFile))
          }
        }
  }
}

tasks.register("refreshSampleData") {
  dependsOn("flywayMigrate")
  doLast {
    println("Refresh Sample Data Dates")

    SingleConnectionDataSource(
            dbConfig["devUrl"]!!,
            dbConfig["user"]!!,
            dbConfig["password"]!!,
            true,
        )
        .let {
          it.connection.use { connection ->
            executeSqlScript(
                connection,
                FileSystemResource("./sample-data/update_observation_dates.sql"),
            )
          }
        }
  }
}
