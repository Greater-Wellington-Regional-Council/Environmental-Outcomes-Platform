# EOP Manager

## Getting Started

### Prerequisites

* Docker
* A Java 17 or later JDK

### Running

As a quick start:

* Start two terminal sessions
* In one session run start an instance of Postgres:
  ```./batect runDatabase```
* In a second session start the application ```./gradlew bootRun```

And if successful, you've got the prerequisites.

For day to day development use your IDE of choice. IntelliJ's community edition is a good full-featured IDE or VSCode
with plugins for Kotlin and Gradle also works (though support for running inline is limited.)

> Running via `./batect runDatabase` will store postgres data in the .postgres folder, you can delete this folder to
> start from a clean slate.
 