# EOP Manager

## Getting Started

### Prerequisites

* Docker
* A Java 17 or later JDK
* a NodeJS / NPM install (for running code formatting locally)


### Building

As a quick start, running a build will ensure you've got the prerequisites installed correctly:

* Start two terminal sessions
* In one session run start an instance of Postgres:
  ```./batect runDatabase```
* In a second session build the application ```./gradlew check```

And if successful, everything you need is installed. 

For day to day development use your IDE of choice. IntelliJ's community edition is a good full-featured IDE or VSCode
with plugins for Kotlin and Gradle also works (though support for running inline is limited.)

> Running via `./batect runDatabase` will store postgres data in the .postgres folder, you can delete this folder to
> start from a clean slate.
 
### Running 

* Start two terminal sessions
* In one session run start an instance of Postgres:
  ```./batect runDatabase```
* In a second session start the application ```./gradlew bootRun```

### Code Formatting

Code is formatted using [Spotless](https://github.com/diffplug/spotless) and prettier. Prettier is a package provided 
from node js, so means for running locally it expects a working Node JS installation on the path. 