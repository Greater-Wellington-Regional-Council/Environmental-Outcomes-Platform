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

Scope: assessment only, with any compatibility fixes split out before upgrading. This PR should not change Spring Boot, Spring Kafka, Spring Framework, Hibernate, or application dependency versions.

Candidates shown across the three packages:

- Spring Boot plugin and starters `3.5.16` → `4.1.0`
- Spring Kafka `3.3.16` → `4.1.0`
- Spring Framework-managed transitive libraries move to Spring Framework 7.x lines.

Current package baseline:

- `Manager`, `IngestAPI`, and `HilltopCrawler` all use the Spring Boot Gradle plugin `3.5.16` and Java/Kotlin JVM target/toolchain `21`.
- All three packages use `org.springframework.kafka:spring-kafka`; `Manager` and `HilltopCrawler` also use Kafka Streams.
- `Manager` uses Spring MVC, WebFlux `WebClient`, Actuator, JDBC, jOOQ, JPA, Hibernate Spatial, Flyway, ShedLock scheduling, Micrometer tracing, and Resilience4j's Spring Boot 3 integration.
- `IngestAPI` uses Spring MVC, Actuator, Spring Security `SecurityFilterChain`, Basic Auth, and Kafka producer support.
- `HilltopCrawler` uses Spring MVC client support, Actuator, JDBC, Flyway, scheduled tasks, Kafka producer support, and Kafka Streams.

Readiness review findings:

- Java 21 is already in place for all three packages, so the immediate blocker is not the runtime/toolchain level.
- Do not upgrade `Manager` while it still depends on `io.github.resilience4j:resilience4j-spring-boot3`; switch to the Spring Boot 4 integration artifact during the actual Boot 4 upgrade.
- Treat `Manager` persistence as a separate readiness area: it currently combines JPA, Hibernate Spatial, Hypersistence Utils, PostGIS JDBC, jOOQ, Flyway, and explicit `spring.jpa.database-platform: org.hibernate.spatial.dialect.postgis.PostgisPG95Dialect`.
- Review the `Manager` Hibernate dialect and spatial stack before Boot 4 because Spring Boot 4 is expected to align with newer Hibernate/Spring Framework baselines.
- Review `Manager`'s explicit `buildscript` dependency on `org.springframework:spring-jdbc:6.2.8`; it should not be left pinned to the Spring Framework 6 line during a Boot 4 move.
- Review `IngestAPI` Spring Security behaviour before upgrading. It uses the modern `SecurityFilterChain` style, but Boot 4/Spring Security changes should be checked against Basic Auth, CSRF disabled for API writes, password encoder id handling for `{bcrypt}`, and actuator health access.
- Review Kafka properties and code before upgrading Spring Kafka: all three packages rely on `JsonSerializer`/`JsonDeserializer`, error-handling deserializers, trusted packages, dead-letter publishing, embedded Kafka tests, and/or Kafka Streams serde configuration.
- Review Actuator exposure before upgrading. `Manager` currently exposes all web endpoints in the default profile (`management.endpoints.web.exposure.include: "*"`), with a narrower prod override; verify this remains intentional under Boot 4 actuator/observability changes.
- `RestTemplate` usage remains present in `Manager` and `HilltopCrawler`; confirm whether Boot 4 keeps the same auto-configuration/customization expectations or whether any preparatory move to `RestClient` is desired.
- Existing Jakarta imports in `Manager` entities/converters are already on the Jakarta namespace, which lowers—but does not remove—the persistence migration risk.

Preparatory-step outcomes:

1. Third-party Spring integration artifacts:
   - `Manager` currently uses `io.github.resilience4j:resilience4j-spring-boot3:2.4.0`; Maven Central also publishes `io.github.resilience4j:resilience4j-spring-boot4:2.4.0`, whose POM references Spring Boot autoconfigure `4.0.0` and Spring Framework `7.0.2`. The eventual Boot 4 PR should switch artifacts rather than keep the Boot 3 integration.
   - Review before upgrade: `org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.9`, ShedLock `7.7.0`, `io.micrometer:micrometer-tracing-bridge-brave`, Spring Kafka test artifacts, and `io.hypersistence:hypersistence-utils-hibernate-60:3.9.4`.
2. Spring Framework / Spring Boot API hotspots:
   - `Manager` pins `org.springframework:spring-jdbc:6.2.8` in the Gradle `buildscript` classpath for Flyway/jOOQ-related build logic; this must not remain on the Spring Framework 6 line in the actual Boot 4 upgrade.
   - `Manager` and `HilltopCrawler` still use `RestTemplate`; `Manager` also uses `WebClient`. No source change is required for this review PR, but client auto-configuration and timeout customisation need smoke tests during the upgrade.
   - `Manager` and `HilltopCrawler` use scheduled tasks; `Manager` also uses ShedLock. These need startup/scheduling smoke coverage under the target Boot line.
3. `IngestAPI` Spring Security:
   - Existing tests cover invalid Basic Auth and authenticated API requests through `MockMvc` in `packages/IngestAPI/src/test/kotlin/nz/govt/eop/ingest/IntegrationTest.kt`.
   - Gap before Boot 4: add or confirm a direct unauthenticated `/actuator/health` test, because `SecurityConfig` explicitly permits that matcher.
   - Keep checking `{bcrypt}` password-id handling, disabled CSRF for API writes, and whether explicit `@EnableWebSecurity` remains necessary.
4. Spring Kafka / Kafka Streams:
   - Existing tests cover `IngestAPI` Kafka production with `@EmbeddedKafka`, `Manager` Kafka listener/DLT/error-handler behaviour with `@EmbeddedKafka`, and `Manager`/`HilltopCrawler` Kafka Streams topologies with `TopologyTestDriver`.
   - High-risk compatibility points for Spring Kafka 4 are JSON serde/type-header settings, `JsonDeserializer` trusted/default type properties, `DefaultErrorHandler`, `DeadLetterPublishingRecoverer`, embedded Kafka test support, and Kafka Streams client version alignment.
5. `Manager` Jakarta / Hibernate / spatial / jOOQ / Flyway:
   - JPA entities and converters already use `jakarta.persistence`, which is a positive readiness signal.
   - Blocker/risk: `spring.jpa.database-platform` is `org.hibernate.spatial.dialect.postgis.PostgisPG95Dialect`, and current tests log that `PostgisPG95Dialect` is deprecated in favour of `org.hibernate.dialect.PostgreSQLDialect`.
   - Review before upgrade: Hibernate Spatial, Hypersistence Utils variant, `@Type(JsonBinaryType::class)`, `@Formula` SQL snippets, PostGIS geometry converters, jOOQ generation, and Flyway migrations against the target Hibernate/Boot line.
6. Actuator / observability:
   - `Manager` exposes all actuator endpoints by default, but `application-prod.yml` narrows production exposure to health only and disables endpoints by default.
   - `Manager` and `IngestAPI` include `micrometer-tracing-bridge-brave`; confirm whether the Boot 4 BOM should own this version and whether Brave remains the desired bridge.
7. Buildscript / plugin classpath pins:
   - The only Spring Framework classpath pin found in the reviewed Gradle files is `Manager`'s `org.springframework:spring-jdbc:6.2.8` buildscript dependency.
   - Keep this as an explicit item in the eventual Boot 4 upgrade PR so build logic does not silently mix Spring Framework 6 and 7 artifacts.

Recommended approach:

- Do not combine this with routine dependency bumps.
- Use this PR as the compatibility checklist and split the following preparatory work before the actual Boot 4 upgrade:
  1. Confirm all third-party Spring integration artifacts have Boot 4-compatible releases, especially Resilience4j for `Manager`, Springdoc for `Manager`, ShedLock, Micrometer tracing bridge usage, and Spring Kafka test support.
  2. Confirm the Spring Framework 7 / Spring Boot 4 migration notes for removed or changed APIs used by these packages.
  3. Check `IngestAPI` Spring Security semantics with Boot 4/Spring Security, including API authentication, password encoding, CSRF, and actuator health exposure.
  4. Check Spring Kafka 4 and Kafka Streams compatibility for all three packages, including JSON serde configuration, `DefaultErrorHandler`, `DeadLetterPublishingRecoverer`, embedded Kafka tests, and Kafka Streams topology tests.
  5. Check Jakarta / Hibernate compatibility for `Manager`, including Hibernate Spatial, Hypersistence Utils, PostGIS JDBC, jOOQ code generation, Flyway migrations, and the configured PostGIS dialect.
  6. Check Actuator/observability configuration, especially `Manager` endpoint exposure and explicit Micrometer tracing dependencies.
  7. Check buildscript/plugin classpath pins so that Spring Framework 6 artifacts are not retained accidentally during a Boot 4 upgrade.
- Split any required source changes into preparatory PRs before the actual Boot 4 upgrade.
- Only after the preparatory work is complete, open a dedicated Spring Boot 4 upgrade PR that changes the Spring Boot plugin/BOM-managed versions together.

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