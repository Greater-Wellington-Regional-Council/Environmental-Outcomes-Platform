import org.flywaydb.gradle.task.FlywayMigrateTask
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.jooq.meta.jaxb.ForcedType

plugins {
  id("org.springframework.boot") version "2.7.3"
  id("io.spring.dependency-management") version "1.0.11.RELEASE"
  kotlin("jvm") version "1.7.10"
  kotlin("plugin.spring") version "1.7.10"
  id("com.diffplug.spotless") version "6.8.0"
  id("org.flywaydb.flyway") version "9.1.6"
  id("nu.studer.jooq") version "7.1.1"
}

group = "nz.govt.eop"

version = "0.0.1-SNAPSHOT"

java.sourceCompatibility = JavaVersion.VERSION_17

repositories { mavenCentral() }

dependencies {
  jooqGenerator("org.postgresql:postgresql")

  runtimeOnly("org.springframework.boot:spring-boot-devtools")
  runtimeOnly("org.postgresql:postgresql")

  implementation("org.springframework.boot:spring-boot-starter-jdbc")
  implementation("org.springframework.boot:spring-boot-starter-jooq")

  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
  implementation("org.flywaydb:flyway-core")
  implementation("io.github.microutils:kotlin-logging-jvm:3.0.3")

  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("io.kotest:kotest-assertions-core:5.5.3")
}

tasks.withType<KotlinCompile> {
  kotlinOptions {
    freeCompilerArgs = listOf("-Xjsr305=strict")
    jvmTarget = "17"
  }
}

tasks.withType<Test> { useJUnitPlatform() }

configure<com.diffplug.gradle.spotless.SpotlessExtension> {
  kotlin {
    ktfmt()
  }
  kotlinGradle { ktfmt() }
  format("sql") {
    target("src/main/resources/**/*.sql")
    prettier(mapOf("prettier" to "2.7.1", "prettier-plugin-sql" to "0.12.1"))
        .config(mapOf("language" to "postgresql", "keywordCase" to "upper"))
  }
}

val dbConfig =
    mapOf(
        "url" to "jdbc:postgresql://${System.getenv("DB_HOST") ?: "localhost"}:5432/eop_test",
        "user" to "postgres",
        "password" to "password")

flyway {
  url = dbConfig["url"]
  user = dbConfig["user"]
  password = dbConfig["password"]
  schemas = arrayOf("public")
  locations = arrayOf("filesystem:./src/main/resources/db/migration")
}

tasks.named<FlywayMigrateTask>("flywayMigrate") { dependsOn("spotlessApply") }

jooq {
  version.set(dependencyManagement.importedProperties["jooq.version"])

  configurations {
    create("main") {
      generateSchemaSourceOnCompilation.set(false)

      jooqConfiguration.apply {
        jdbc.apply {
          driver = "org.postgresql.Driver"
          url = dbConfig["url"]
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
                      name = "blob"
                      includeExpression = ".*"
                      includeTypes = "GEOMETRY"
                    })
          }
          generate.apply {
            isUdts = false
            isRoutines = false
            isDeprecated = false
            isRecords = false

            isPojosAsKotlinDataClasses = true
            isImmutablePojos = true
            isFluentSetters = true
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
  allInputsDeclared.set(true)
}
