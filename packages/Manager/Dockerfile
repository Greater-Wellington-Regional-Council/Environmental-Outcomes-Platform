FROM eclipse-temurin:17 as builder
WORKDIR application
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} application.jar
RUN java -Djarmode=layertools -jar application.jar extract

FROM eclipse-temurin:17
WORKDIR application
COPY --from=builder application/dependencies/ ./
COPY --from=builder application/spring-boot-loader/ ./
COPY --from=builder application/application/ ./
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=80", "org.springframework.boot.loader.launch.JarLauncher"]

EXPOSE 8080
HEALTHCHECK --interval=5s --retries=5 --start-period=60s CMD curl --fail http://localhost:8080/actuator/health || exit 1
