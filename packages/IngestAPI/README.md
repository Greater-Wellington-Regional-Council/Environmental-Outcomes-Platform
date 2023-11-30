# EOP IngestAPI

The EOP IngestAPI accepts envrionmental data and stores this as Kafka messages for subsequent processing by other EOP services. It accepts this data via HTTP API endpoints authenticated using Basic Authentication. These accept JSON data, which is passed onto a Kafka consumer.

It's made up of a simple Spring Boot application written in Kotlin, and packaged up for deployment to ECS as a Docker container.

## Getting Started

### Prerequisites

* Docker
* A Java 17 or later JDK

### Building

As a quick start, running a build will ensure you've got the prerequisites installed correctly:

* Start two terminal sessions
* In one session, start services required for development ```./batect --output=all runSupportServices```
* In a second session build the application ```./gradlew check```

And if successful, everything you need is installed.

For day to day development use your IDE of choice. IntelliJ's community edition is a good full-featured IDE or VSCode
with plugins for Kotlin and Gradle also works (though support for running inline is limited.)


### Running

* Start two terminal sessions
* In one session, start services required for development ```./batect --output=all runSupportServices```
* In a second session start the application ```./gradlew bootRun```

### Code Formatting

Code is formatted using [Spotless](https://github.com/diffplug/spotless)

## Config

### Profiles

There are currently 2 spring profiles available for configuring the application in different modes

* `prod` - For running in production, doesn't add test data to the database, and tweaks logging settings.
* `ssl` - For running with SSL enabled, when enabling this requires other config properties are set (see below)

> Note: in production, the expectation is that both the `prod` and `ssl` profiles will be enabled

## Kafka

When the application boots, it will automatically create any topics needed.

The support services started by Batect include a Management UI for Kafka, which you can access at http://localhost:8081.

[Kaf](https://github.com/birdayz/kaf) is also a useful CLI for Kafka, which can be run via sshuttle.

## SSL

When running in a deployment environment, the application should be running with SSL enabled. Because we package the
application in a Docker container we need to be able to provide the Keystore to use without baking it into the container
image.

There are various ways to do this depending on deployment environment, but to support Amazon ECS as a target our
approach is to provide the keystore content as a Base64 encoded string passed in via the environment, and the app has
some bootstrapping code to store the keystore on the file system before it gets accessed.
