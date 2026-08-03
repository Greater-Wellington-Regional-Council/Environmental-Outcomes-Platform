# HilltopCrawler upgrade plan

This note captures the package upgrade plan created while reviewing `build.gradle.kts`.

## Current build stack

- Spring Boot: `3.5.6`
- Kotlin JVM/plugin.spring: `2.1.21`
- Gradle wrapper: upgraded from `8.5` to `8.14.3`
- Java target/runtime: Java 17
- Docker runtime: `eclipse-temurin:17`
- Flyway: `11.20.0`, currently declared in several places

## Completed first PR scope

- Upgraded Gradle wrapper to `8.14.3`.
- Replaced `java.sourceCompatibility = JavaVersion.VERSION_17` with a Java 17 toolchain.
- Replaced old `KotlinCompile.kotlinOptions` usage with Kotlin `compilerOptions`.
- Preserved strict JSR-305 handling with `-Xjsr305=strict`.
- Kept Java/Kotlin target on Java 17 to match the existing Docker runtime.
- Validated with:

  ```bash
  ./gradlew spotlessApply && ./gradlew --warning-mode all clean check
  ```

## Follow-up plan

### Phase 1 — Keep the baseline green

Goal: ensure the modernised Gradle wrapper and build DSL remain stable.

Recommended checks:

```bash
./gradlew --warning-mode all clean check
./batect check
```

Success criteria:

- Local Gradle build passes.
- Batect/CI build passes.
- Any warnings are either fixed or documented.

### Phase 2 — Fix existing deprecation warnings

The current build is green, but these warnings were observed during validation:

- `HilltopFetcher.kt`: deprecated Bucket4j `Bandwidth.simple(...)`.
- `RestTemplateConfig.kt`: deprecated `RestTemplateBuilder.setConnectTimeout(...)`.
- `RestTemplateConfig.kt`: deprecated `RestTemplateBuilder.setReadTimeout(...)`.
- `logback-test.xml`: deprecated Logback `converterClass` attribute; use `class` instead.

Success criteria:

- `./gradlew --warning-mode all clean check` produces fewer/no deprecation warnings.
- Behaviour remains unchanged.

### Phase 3 — Add dependency update visibility

Goal: make future upgrade checks repeatable.

Options:

- Add `com.github.ben-manes.versions` to this package; or
- Add dependency update tooling at the repository/root level if that is the monorepo convention.

Example command after adding tooling:

```bash
./gradlew dependencyUpdates
```

Success criteria:

- There is a repeatable command for checking outdated plugins and dependencies.
- Upgrade work can be split into safe patch/minor updates versus riskier major changes.

### Phase 4 — Rationalise Flyway version management

Flyway is currently declared in multiple places:

```kotlin
id("org.flywaydb.flyway") version "11.20.0"
classpath("org.flywaydb:flyway-database-postgresql:11.20.0")
implementation("org.flywaydb:flyway-core:11.20.0")
implementation("org.flywaydb:flyway-database-postgresql:11.20.0")
```

Recommended steps:

1. Check whether Gradle Flyway tasks are actually used by developers or CI.
2. If not used, remove the Gradle Flyway plugin and `buildscript` classpath, and rely on Spring Boot runtime Flyway integration.
3. If Gradle Flyway tasks are used, centralise the Flyway version so plugin, classpath, and runtime dependencies cannot drift.
4. Decide whether Flyway should be managed by Spring Boot’s dependency management or remain explicitly pinned.

Success criteria:

- Flyway versioning has a single clear source of truth.
- Database migrations still run in application startup/test paths.

### Phase 5 — Review non-Boot-managed dependencies

Review/update these dependencies deliberately because they are outside Spring Boot’s managed BOM:

```kotlin
runtimeOnly("net.logstash.logback:logstash-logback-encoder:9.0")
implementation("io.github.microutils:kotlin-logging-jvm:3.0.5")
implementation("com.bucket4j:bucket4j-core:8.10.1")
testImplementation("io.kotest:kotest-assertions-core:5.9.1")
testImplementation("io.kotest:kotest-assertions-json:5.9.1")
testImplementation("org.mockito.kotlin:mockito-kotlin:5.4.0")
```

Special note: `io.github.microutils:kotlin-logging-jvm` has largely moved to the maintained `io.github.oshai:kotlin-logging` artifact line. Treat that as a small migration because source imports may need to change.

Success criteria:

- Explicit versions are intentional.
- Runtime dependencies remain compatible with Spring Boot’s managed stack.
- Tests cover any source-level dependency migrations.

### Phase 6 — Optional Java 21 migration

Only do this after the Java 17 build is stable and dependency cleanups are under control.

Required changes:

- Change Gradle toolchain from Java 17 to Java 21.
- Change Kotlin JVM target to Java 21 if desired.
- Change Docker images from `eclipse-temurin:17` to `eclipse-temurin:21`.
- Check/update the shared Batect `java-build-env` container.
- Run full tests and a smoke test.

Success criteria:

- App builds and runs on Java 21.
- Docker healthcheck passes.
- Kafka/Postgres/Flyway integration paths remain stable.

## Suggested next PR

Fix the deprecation warnings surfaced by `--warning-mode all`, starting with the small Logback XML change and Spring `RestTemplateBuilder` timeout API updates.