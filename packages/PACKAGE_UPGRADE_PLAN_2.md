# Package upgrade plan 2 for Manager, IngestAPI, and HilltopCrawler

This plan lists remaining package-upgrade work for the Kotlin/Spring packages while staying on the current major platform lines:

- Spring Boot 3.x / Spring Framework 6.x
- Gradle 8.x
- Java/Kotlin JVM target/toolchain 21

Packages covered:

- `packages/Manager`
- `packages/IngestAPI`
- `packages/HilltopCrawler`

## Explicit non-goals for this plan

- Do not upgrade to Spring Boot 4 or Spring Framework 7.
- Do not upgrade to Spring Kafka 4 as part of this plan unless a supported Spring Boot 3-compatible path is confirmed.
- Do not upgrade to Gradle 9.
- Do not move `Manager` to Spring Boot 4-specific integration artifacts such as `resilience4j-spring-boot4`.
- Do not combine runtime dependency updates with Gradle wrapper or build-tool major-version changes.

## Current platform baseline

- `Manager`, `IngestAPI`, and `HilltopCrawler` use the Spring Boot Gradle plugin `3.5.16`.
- All three packages use Java/Kotlin JVM target/toolchain `21`.
- Gradle is currently on the `8.14.x` line.
- Spring Boot 3.5.x keeps the applications on the Spring Framework 6.x line.

## Remaining recommended PRs

### PR 1 — Manager Kotest 5 maintenance and Kotest 6 watch item

Scope: `Manager` Kotest dependencies only.

Status: keep `Manager` on Kotest 5 unless `kotest-extensions-spring` has a compatible release for the target Kotest major version and that release is compatible with Spring Boot 3.

Current candidates from the broader dependency report:

- `io.kotest:kotest-runner-junit5` `5.9.1` → `6.2.3`
- `io.kotest:kotest-assertions-core` `5.9.1` → `6.2.3`
- `io.kotest:kotest-framework-engine` `5.9.1` → `6.2.3`

Spring Boot 3 / Gradle 8 position:

- Treat Kotest 6 as a watch item, not an automatic upgrade.
- `Manager` also depends on `io.kotest.extensions:kotest-extensions-spring:1.3.0`.
- Do not mix incompatible Kotest core/runner artifacts with the Spring extension because that can break test discovery or Spring test integration.
- If a Spring Boot 3-compatible Kotest 6 path becomes available, update the Kotest runner/assertions/framework artifacts and `kotest-extensions-spring` together in one focused PR.

Recommended validation:

```bash
cd packages/Manager && ./gradlew test --no-daemon
```

### PR 2 — Spring Boot 3.5.x patch maintenance

Scope: Spring Boot 3 patch-line maintenance across `Manager`, `IngestAPI`, and `HilltopCrawler`.

Spring Boot 3 / Gradle 8 position:

- Stay on Spring Boot 3.x, preferably the latest available Spring Boot 3.5.x patch release.
- Keep Spring Framework dependencies aligned through the Spring Boot 3 BOM; do not pin Spring Framework 7 artifacts.
- Keep Spring integration libraries on their Spring Boot 3-compatible artifacts and versions.
- Keep `Manager` on `io.github.resilience4j:resilience4j-spring-boot3` rather than switching to the Spring Boot 4 artifact.
- Keep `Manager` Springdoc on the `2.x` line unless a newer `2.x` Spring Boot 3-compatible release is available.

Recommended approach:

- Use each package's dependency update report to identify Spring Boot 3.5.x patch updates only.
- Apply the Spring Boot plugin/BOM patch update consistently across all three Kotlin/Spring packages.
- Avoid pulling in Spring Framework 7, Spring Kafka 4, Hibernate 7, or Spring Boot 4-only integration artifacts.
- Review any explicit Spring Framework pins, especially `Manager`'s buildscript dependency on `org.springframework:spring-jdbc:6.2.8`, and keep them on the Spring Framework 6 line while the applications stay on Spring Boot 3.

Recommended validation:

```bash
cd packages/Manager && ./gradlew clean check --no-daemon
cd ../IngestAPI && ./gradlew clean check --no-daemon
cd ../HilltopCrawler && ./gradlew clean check --no-daemon
```

Also run each package's `./batect check` where available if the patch update affects runtime behaviour, containers, Kafka, database migrations, or generated code.

### PR 3 — Kafka stack updates within Spring Boot 3 compatibility

Scope: Kafka libraries only, constrained to versions supported with Spring Boot 3.x / Spring Framework 6.x.

Candidates from the broader dependency report:

- `org.apache.kafka:kafka-streams` `3.9.2` → newer stable 3.x or compatible 4.x only if supported by the current Spring Boot 3/Spring Kafka stack.
- `org.springframework.kafka:spring-kafka` `3.3.16` → newer 3.x patch/minor release if compatible with Spring Boot 3.5.x.

Spring Boot 3 / Gradle 8 position:

- Do not move to Spring Kafka 4 in this plan.
- Prefer Spring Kafka versions managed by the Spring Boot 3 BOM.
- If overriding Spring Kafka is necessary, confirm compatibility with Spring Boot 3.5.x, Spring Framework 6.x, embedded Kafka tests, and Kafka Streams usage before changing versions.
- Treat Kafka Streams updates as separate from Spring Kafka updates when possible.

High-risk compatibility points:

- `JsonSerializer` / `JsonDeserializer` configuration.
- Trusted packages and default type properties.
- Error-handling deserializers.
- `DefaultErrorHandler` and `DeadLetterPublishingRecoverer` behaviour.
- Embedded Kafka test support.
- Kafka Streams serde configuration and topology tests.

Recommended validation:

```bash
cd packages/Manager && ./gradlew test --no-daemon
cd ../IngestAPI && ./gradlew test --no-daemon
cd ../HilltopCrawler && ./gradlew test --no-daemon
```

Add or run an integration smoke test with local Kafka if available through Batect.

### PR 4 — Manager persistence and API library updates within Spring Boot 3 compatibility

Scope: `Manager` data/API dependencies that can be safely updated without moving to Spring Boot 4.

Candidates from the broader dependency report:

- Hibernate Spatial `6.6.53.Final` → newer Hibernate 6.x only.
- `org.springdoc:springdoc-openapi-starter-webmvc-ui` `2.8.9` → newer Spring Boot 3-compatible `2.x` only.
- `de.grundid.opendatalab:geojson-jackson` `1.14` → newer compatible version after API review.
- JAXB API `3.0.1` → newer compatible version only if it does not force Jakarta/JAXB or transitive dependency changes outside the Spring Boot 3 support window.

Spring Boot 3 / Gradle 8 position:

- Do not upgrade Hibernate Spatial to the Hibernate 7 line in this plan.
- Do not upgrade Springdoc to the Spring Boot 4-oriented `3.x` line in this plan.
- Keep Hypersistence Utils on a variant compatible with the active Hibernate 6.x line.
- Keep `spring.jpa.database-platform` review scoped to a Spring Boot 3 / Hibernate 6-compatible dialect configuration.

Recommended approach:

- Split this into small PRs rather than one large `Manager` update:
  1. Springdoc `2.x` patch/minor update.
  2. Hibernate Spatial `6.x` / Hypersistence Utils compatibility review.
  3. GeoJSON/JAXB update after source and serialization compatibility checks.
- Validate generated jOOQ code and Flyway-backed persistence paths after any persistence library changes.

Recommended validation:

```bash
cd packages/Manager
./gradlew clean generateJooq compileKotlin test --no-daemon
```

Use `./batect check` if local database-backed Gradle tasks require support services.

### PR 5 — Micrometer tracing maintenance on the Spring Boot 3 line

Scope: cross-cutting observability runtime library.

Remaining candidate from the broader dependency report:

- `io.micrometer:micrometer-tracing-bridge-brave` `1.5.12` → newer Spring Boot 3-compatible version.

Spring Boot 3 / Gradle 8 position:

- Prefer versions managed by the Spring Boot 3 BOM.
- If explicit declarations remain necessary, only use versions compatible with Spring Boot 3.5.x.
- Do not use a version that assumes Spring Boot 4 observability auto-configuration or Spring Framework 7.

Recommended validation:

```bash
cd packages/Manager && ./gradlew test --no-daemon
cd ../IngestAPI && ./gradlew test --no-daemon
```

### PR 6 — Gradle 8 wrapper maintenance and plugin compatibility

Scope: Gradle 8 patch-line maintenance only.

Current report from the broader dependency plan:

- Gradle `8.14.5` → Gradle 9.x is visible, but Gradle 9 is out of scope for this plan.

Spring Boot 3 / Gradle 8 position:

- Stay on Gradle 8.x.
- Use the latest stable Gradle 8 patch release available to the project, if newer than the current wrapper.
- Do not upgrade wrappers to Gradle 9 in this plan.
- Keep Gradle wrapper maintenance separate from runtime dependency updates.

Recommended approach:

- Confirm the latest stable Gradle 8.x wrapper release.
- Update the wrapper only if there is a newer Gradle 8.x patch.
- Run warning-mode validation to keep the build ready for a future Gradle 9 discussion without actually upgrading to Gradle 9.

Recommended validation:

```bash
cd packages/Manager && ./gradlew clean check --warning-mode all --no-daemon
cd ../IngestAPI && ./gradlew clean check --warning-mode all --no-daemon
cd ../HilltopCrawler && ./gradlew clean check --warning-mode all --no-daemon
```

## Suggested order

1. Spring Boot 3.5.x patch maintenance across all three packages.
2. Kafka stack updates within the Spring Boot 3-supported version range.
3. Manager persistence and API library updates within Spring Boot 3 compatibility.
4. Micrometer tracing maintenance on the Spring Boot 3 line.
5. Manager Kotest 5 maintenance / Kotest 6 watch item.
6. Gradle 8 wrapper maintenance, only if a newer Gradle 8 patch is available.

## General guardrails

- Keep every PR on Spring Boot 3.x, Spring Framework 6.x, and Gradle 8.x.
- Keep each PR focused on one dependency family or risk area.
- Avoid combining runtime dependency changes with build-tool changes.
- Prefer versions managed by the Spring Boot 3 BOM unless there is a documented reason to override.
- Prefer package-aligned versions where the same dependency appears in multiple packages.
- Use each package's `dependencyUpdates` task before and after changes.
- Run `./batect check` for changes involving database migrations, Kafka, Docker/runtime behaviour, or Spring Boot patch updates.
- If a dependency's latest major version targets Spring Boot 4, Spring Framework 7, Hibernate 7, Spring Kafka 4, or Gradle 9, record it as deferred rather than including it in this plan.