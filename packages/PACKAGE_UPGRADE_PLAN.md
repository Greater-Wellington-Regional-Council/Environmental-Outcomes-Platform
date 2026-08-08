# Package upgrade plan for Manager, IngestAPI, and HilltopCrawler

This plan lists only package-upgrade work that is not yet complete for the Kotlin/Spring packages:

- `packages/Manager`
- `packages/IngestAPI`
- `packages/HilltopCrawler`

## Remaining recommended PRs

### PR 1 — Manager Kotest major-version decision

Scope: `Manager` Kotest dependencies only.

Status: blocked pending a `kotest-extensions-spring` release newer than `1.3.0` that supports the target Kotest major version.

Remaining candidates:

- `io.kotest:kotest-runner-junit5` `5.9.1` → `6.2.3`
- `io.kotest:kotest-assertions-core` `5.9.1` → `6.2.3`
- `io.kotest:kotest-framework-engine` `5.9.1` → `6.2.3`

Current note:

- These were intentionally kept on Kotest 5 during the earlier test dependency refresh.
- `Manager` also depends on `io.kotest.extensions:kotest-extensions-spring:1.3.0`.
- Do not move `Manager` to Kotest 6 until the Spring extension has a compatible release; mixing incompatible Kotest core/runner artifacts with the Spring extension can break test discovery or Spring test integration.

Recommended approach:

- Keep `Manager` on Kotest 5 while `kotest-extensions-spring` remains at `1.3.0`.
- Monitor `kotest-extensions-spring` for a newer compatible release.
- Once available, update the Kotest runner/assertions/framework artifacts and `kotest-extensions-spring` together.
- Review Kotest 6 migration requirements for the existing `Manager` test suite before making the major-version move.

Recommended validation:

```bash
cd packages/Manager && ./gradlew test --no-daemon
```

### PR 2 — Spring Boot 4 readiness review, not upgrade

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

Recommended validation for the eventual upgrade:

```bash
cd packages/Manager && ./gradlew clean check --no-daemon
cd ../IngestAPI && ./gradlew clean check --no-daemon
cd ../HilltopCrawler && ./gradlew clean check --no-daemon
```

Also run each package's `./batect check` where available.

### PR 3 — Kafka stack update

Scope: Kafka libraries only, after Spring Boot 4 planning is clear.

Candidates shown:

- `org.apache.kafka:kafka-streams` `3.9.2` → `4.3.1` in `Manager` and `HilltopCrawler`
- `org.springframework.kafka:spring-kafka` `3.3.16` → `4.1.0` in all three packages

Recommended approach:

- Prefer handling `spring-kafka` as part of the Spring Boot 4 work unless there is a supported Spring Boot 3.5-compatible patch/minor path.
- Treat Kafka Streams as a separate PR from Spring Kafka if it can be updated independently.

Recommended validation:

```bash
cd packages/Manager && ./gradlew test --no-daemon
cd ../IngestAPI && ./gradlew test --no-daemon
cd ../HilltopCrawler && ./gradlew test --no-daemon
```

Add an integration smoke test with local Kafka if available through Batect.

### PR 4 — Manager persistence and API library review

Scope: Manager-specific data/API dependencies.

Candidates shown for `Manager`:

- Hibernate Spatial `6.6.53.Final` → `7.4.5.Final`
- `org.springdoc:springdoc-openapi-starter-webmvc-ui` `2.8.9` → `3.1.0`
- `de.grundid.opendatalab:geojson-jackson` `1.14` → `3.0`
- JAXB API `3.0.1` → `4.0.5`

Recommended approach:

- Split this into small PRs rather than one large Manager update:
  1. Springdoc update, ideally after the Spring Boot 4 path is decided.
  2. Hibernate Spatial/JAXB/GeoJSON updates after compatibility checks.

Recommended validation:

```bash
cd packages/Manager
./gradlew clean generateJooq compileKotlin test --no-daemon
```

Use `./batect check` if local database-backed Gradle tasks require support services.

### PR 5 — Micrometer tracing update

Scope: cross-cutting observability runtime library.

Remaining candidate:

- `io.micrometer:micrometer-tracing-bridge-brave` `1.5.12` → `1.7.0` in `Manager` and `IngestAPI`

Recommended approach:

- Check whether Spring Boot's BOM should own this version rather than explicit declarations.
- Consider deferring if it is better handled alongside Spring Boot 4.

Recommended validation:

```bash
cd packages/Manager && ./gradlew test --no-daemon
cd ../IngestAPI && ./gradlew test --no-daemon
```

### PR 6 — Gradle 9 wrapper update

Scope: Gradle 9 compatibility.

Current report:

- Gradle `8.14.5` → `9.6.1`, with `9.7.0-rc-2` also visible.

Current note:

- Gradle 8 deprecation cleanup has already been checked in this PR.
- `Manager`, `IngestAPI`, and `HilltopCrawler` passed `clean check --warning-mode all` on Gradle `8.14.5` with no Gradle deprecation warnings.

Recommended approach:

- Update wrappers to the latest stable Gradle 9 release in a dedicated PR.
- Keep this separate from runtime dependency updates because Gradle major upgrades can expose plugin compatibility issues.
- Validate all three packages and Batect paths after the wrapper update.

Recommended validation:

```bash
cd packages/Manager && ./gradlew clean check --warning-mode all --no-daemon
cd ../IngestAPI && ./gradlew clean check --warning-mode all --no-daemon
cd ../HilltopCrawler && ./gradlew clean check --warning-mode all --no-daemon
```

## Suggested order

1. Manager Kotest major-version decision.
2. Spring Boot 4 readiness review and preparatory fixes.
3. Kafka stack update, coordinated with Spring Boot 4 decisions.
4. Micrometer tracing update, unless folded into Spring Boot 4 work.
5. Gradle 9 wrapper update.

## General guardrails

- Keep each PR focused on one dependency family or risk area.
- Avoid combining runtime dependency changes with build-tool changes.
- Prefer package-aligned versions where the same dependency appears in multiple packages.
- Use each package's `dependencyUpdates` task before and after changes.
- Run `./batect check` for changes involving database migrations, Kafka, Docker/runtime behaviour, or Spring Boot major versions.