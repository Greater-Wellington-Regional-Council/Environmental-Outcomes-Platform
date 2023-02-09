package nz.govt.eop.ingestapi

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class IngestApiApplication

fun main(args: Array<String>) {
    runApplication<IngestApiApplication>(*args)
}
