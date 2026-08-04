# Package upgrade plan for Manager, IngestAPI, and HilltopCrawler

This plan groups the next sensible package-update PRs for the Kotlin/Spring packages:

- `packages/Manager`
- `packages/IngestAPI`
- `packages/HilltopCrawler`

It is based on the current `build.gradle.kts` files and `./gradlew dependencyUpdates` output from each package.

## Current in-flight PR

### PR 1 — Test dependency refresh

Scope: Kotest, Mockito Kotlin, and MockK only.

- `Manager`
  - `io.kotest:kotest-runner-junit5` `5.9.1` → `6.2.3`
  - `io.kotest:kotest-assertions-core` `5.9.1` → `6.2.3`
  - `io.kotest:kotest-framework-engine` `5.9.1` → `6.2.3`
  - `io.mockk:mockk` `1.14.7` → `1.14.11`
  - `org.mockito.kotlin:mockito-kotlin` `6.0.0` → `6.3.0`
- `IngestAPI`
  - `io.kotest:kotest-assertions-core` `6.0.7` → `6.2.3`
- `HilltopCrawler`
  - `io.kotest:kotest-assertions-core` `5.9.1` → `6.2.3`
  - `io.kotest:kotest-assertions-json` `5.9.1` → `6.2.3`
  - `org.mockito.kotlin:mockito-kotlin` `5.4.0` → `6.3.0`

Recommended validation:

```bash
cd packages/Manager && ./gradlew test --no-daemon
cd ../IngestAPI && ./gradlew test --no-daemon
cd ../HilltopCrawler && ./gradlew test --no-daemon
```

## Recommended follow-up PRs

### PR 2 — Lightweight Gradle tooling updates

Scope: build tooling only; no runtime dependency changes.

Candidates shown across the three packages:

- `com.diffplug.spotless` `8.8.0` → `8.9.0`
- `com.github.ben-manes.versions` `0.52.0` → `0.59.0`

Why this grouping:

- These are low-risk build-time updates.
- They are common to all three packages.
- They improve formatting/dependency-update maintenance without changing application runtime behaviour.

Recommended validation:

```bash
for pkg in Manager IngestAPI HilltopCrawler; do
  (cd "packages/$pkg" && ./gradlew spotlessCheck dependencyUpdates --no-daemon)
done
```

### PR 3 — `logstash-logback-encoder` alignment

Scope: logging encoder only.

Current state:

- `Manager`: `9.0`
- `IngestAPI`: `8.1` → candidate `9.0`
- `HilltopCrawler`: `9.0`

Recommended change:

- Update `IngestAPI` to `net.logstash.logback:logstash-logback-encoder:9.0` so all three packages align.

Why this grouping:

- Small, focused runtime dependency update.
- Keeps logging format risk isolated from broader Spring/Kafka updates.

Recommended validation:

```bash
cd packages/IngestAPI && ./gradlew test --no-daemon
```

Also smoke-test application startup if logging configuration is environment-sensitive.

### PR 4 — Kotlin logging migration

Scope: `kotlin-logging-jvm` only.

Current state across the three packages:

- `io.github.microutils:kotlin-logging-jvm:3.0.5`

Recommended change:

- Migrate to the maintained `io.github.oshai:kotlin-logging-jvm` artifact line.
- Use the same target version in all three packages.

Why this grouping:

- This is likely a small source-level migration, not just a version bump.
- Imports may need to change from the old `mu.KotlinLogging` style depending on current source usage.
- Keeping this separate makes any logging-source changes easy to review.

Recommended validation:

```bash
for pkg in Manager IngestAPI HilltopCrawler; do
  (cd "packages/$pkg" && ./gradlew compileKotlin test --no-daemon)
done
```

### PR 5 — Flyway version rationalisation

Scope: Flyway declarations and version management in `Manager` and `HilltopCrawler`.

Current state:

- `Manager` and `HilltopCrawler` both declare Flyway in multiple places:
  - Gradle plugin: `org.flywaydb.flyway` `11.20.0`
  - buildscript classpath: `org.flywaydb:flyway-database-postgresql` `11.20.0`
  - runtime dependencies: `org.flywaydb:flyway-core` / `org.flywaydb:flyway-database-postgresql` `11.20.0`
- Candidate shown by dependency reports: `13.1.0`

Recommended approach:

1. First PR: rationalise version management without changing the Flyway version.
   - Introduce a single `val flywayVersion = "11.20.0"` in each package.
   - Use it for plugin/classpath/runtime declarations where Gradle Kotlin DSL allows.
   - Confirm whether Gradle Flyway tasks are still required or Spring Boot runtime Flyway is sufficient.
2. Later PR: update Flyway `11.20.0` → `13.1.0` if still appropriate.

Why this grouping:

- Flyway affects database migration behaviour and should be isolated.
- Reducing duplicate version declarations first lowers risk before a major version update.

Recommended validation:

```bash
cd packages/Manager && ./gradlew flywayInfo test --no-daemon
cd ../HilltopCrawler && ./gradlew flywayInfo test --no-daemon
```

If `flywayInfo` requires local database services, validate via the package `batect check` path instead.

### PR 6 — Spring Boot 4 readiness review, not upgrade

Scope: assessment only, with any compatibility fixes split out before upgrading.

Candidates shown across the three packages:

- Spring Boot plugin and starters `3.5.16` → `4.1.0`
- Spring Kafka `3.3.16` → `4.1.0`
- Spring Framework-managed transitive libraries move to Spring Framework 7.x lines.

Recommended approach:

- Do not combine this with routine dependency bumps.
- Create a compatibility checklist first:
  - Spring Boot 4 / Spring Framework 7 migration notes.
  - Spring Security changes for `IngestAPI`.
  - Spring Kafka 4 changes for all three packages.
  - Jakarta / Hibernate compatibility for `Manager`.
  - Actuator/observability changes.
- Split any required source changes into preparatory PRs before the actual Boot 4 upgrade.

Why this grouping:

- This is the highest-risk dependency move in the current reports.
- It affects application startup, security, Kafka integration, database/JPA/JOOQ integration, tests, and Docker/Batect validation.

Recommended validation for the eventual upgrade:

```bash
for pkg in Manager IngestAPI HilltopCrawler; do
  (cd "packages/$pkg" && ./gradlew clean check --no-daemon)
done
```

Also run each package's `./batect check` where available.

### PR 7 — Kafka stack update

Scope: Kafka libraries only, after Spring Boot 4 planning is clear.

Candidates shown:

- `org.apache.kafka:kafka-streams` `3.9.2` → `4.3.1` in `Manager` and `HilltopCrawler`
- `org.springframework.kafka:spring-kafka` `3.3.16` → `4.1.0` in all three packages

Recommended approach:

- Prefer handling `spring-kafka` as part of the Spring Boot 4 work unless there is a supported Spring Boot 3.5-compatible patch/minor path.
- Treat Kafka Streams as a separate PR from Spring Kafka if it can be updated independently.

Why this grouping:

- Kafka and Kafka Streams changes can affect message serialization, embedded test infrastructure, and runtime broker compatibility.
- The three packages communicate through Kafka topics, so cross-package behaviour matters.

Recommended validation:

```bash
cd packages/Manager && ./gradlew test --no-daemon
cd ../IngestAPI && ./gradlew test --no-daemon
cd ../HilltopCrawler && ./gradlew test --no-daemon
```

Add an integration smoke test with local Kafka if available through Batect.

### PR 8 — Manager persistence and API library review

Scope: Manager-specific data/API dependencies.

Candidates shown for `Manager`:

- `nu.studer.jooq` Gradle plugin `9.0` → `10.2.1`
- jOOQ `3.19.35` → `3.21.6`
- Hibernate Spatial `6.6.53.Final` → `7.4.5.Final`
- `org.springdoc:springdoc-openapi-starter-webmvc-ui` `2.8.9` → `3.1.0`
- `de.grundid.opendatalab:geojson-jackson` `1.14` → `3.0`
- PostgreSQL driver `42.6.2` / `42.7.11` → `42.7.13`
- JAXB API `3.0.1` → `4.0.5`

Recommended approach:

- Split this into small PRs rather than one large Manager update:
  1. PostgreSQL driver patch alignment.
  2. jOOQ Gradle plugin and jOOQ version update with code generation validation.
  3. Springdoc update, ideally after the Spring Boot 4 path is decided.
  4. Hibernate Spatial/JAXB/GeoJSON updates after compatibility checks.

Why this grouping:

- Manager has the most database and generated-code complexity.
- jOOQ/Flyway/PostGIS/Hibernate changes can interact in non-obvious ways.

Recommended validation:

```bash
cd packages/Manager
./gradlew clean generateJooq compileKotlin test --no-daemon
```

Use `./batect check` if local database-backed Gradle tasks require support services.

### PR 9 — Coroutines and Micrometer updates

Scope: cross-cutting runtime libraries.

Candidates shown:

- `org.jetbrains.kotlinx:kotlinx-coroutines-*` `1.10.2` → `1.11.0` in `Manager`
- `io.micrometer:micrometer-tracing-bridge-brave` `1.5.12` → `1.7.0` in `Manager` and `IngestAPI`

Recommended approach:

- Keep coroutines and Micrometer in separate PRs unless a Spring Boot upgrade manages them together.
- Check whether Spring Boot's BOM should own these versions rather than explicit declarations.

Why this grouping:

- Coroutines affect async/reactive code paths.
- Micrometer tracing changes can affect observability and propagated trace context.

Recommended validation:

```bash
cd packages/Manager && ./gradlew test --no-daemon
cd ../IngestAPI && ./gradlew test --no-daemon
```

### PR 10 — Gradle wrapper major-version planning

Scope: Gradle 9 compatibility.

Current report:

- Gradle `8.14.5` → `9.6.1`, with `9.7.0-rc-2` also visible.
- Reports warn that deprecated Gradle features were used, making the build incompatible with Gradle 9.0.

Recommended approach:

- First PR: run with `--warning-mode all` and fix/document deprecations while staying on Gradle 8.
- Later PR: update wrappers to the latest stable Gradle 9 release once warnings are resolved.

Why this grouping:

- Gradle major upgrades can break build logic and plugins even when application code is unchanged.
- Fixing deprecations first reduces risk and makes the eventual wrapper update smaller.

Recommended validation:

```bash
for pkg in Manager IngestAPI HilltopCrawler; do
  (cd "packages/$pkg" && ./gradlew clean check --warning-mode all --no-daemon)
done
```

## Suggested order

1. Complete PR 1: Kotest / Mockito Kotlin / MockK.
2. PR 2: lightweight Gradle tooling updates.
3. PR 3: `logstash-logback-encoder` alignment.
4. PR 4: Kotlin logging migration.
5. PR 5: Flyway version rationalisation.
6. PR 10 first half: Gradle deprecation cleanup while staying on Gradle 8.
7. PR 8 small parts: Manager PostgreSQL driver and jOOQ validation.
8. PR 6: Spring Boot 4 readiness review and preparatory fixes.
9. PR 7: Kafka stack update, coordinated with Spring Boot 4 decisions.
10. PR 10 second half: Gradle 9 wrapper update.

## General guardrails

- Keep each PR focused on one dependency family or risk area.
- Avoid combining runtime dependency changes with build-tool changes.
- Prefer package-aligned versions where the same dependency appears in multiple packages.
- Use each package's `dependencyUpdates` task before and after changes.
- Run `./batect check` for changes involving database migrations, Kafka, Docker/runtime behaviour, or Spring Boot major versions.