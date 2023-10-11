package nz.govt.eop.hilltop_crawler.api.requests

import java.time.YearMonth
import org.springframework.web.util.DefaultUriBuilderFactory

fun buildSiteListUrl(hilltopUrl: String): String =
    DefaultUriBuilderFactory()
        .uriString(hilltopUrl)
        .queryParam("Service", "Hilltop")
        .queryParam("Request", "SiteList")
        .queryParam("Location", "Yes")
        .build()
        .toASCIIString()

fun buildMeasurementListUrl(hilltopUrl: String, siteId: String): String =
    DefaultUriBuilderFactory()
        .uriString(hilltopUrl)
        .queryParam("Service", "Hilltop")
        .queryParam("Request", "MeasurementList")
        .queryParam("Site", siteId)
        .build()
        .toASCIIString()

fun buildPastMeasurementsUrl(
    hilltopUrl: String,
    siteId: String,
    measurementName: String,
    month: YearMonth
): String =
    DefaultUriBuilderFactory()
        .uriString(hilltopUrl)
        .queryParam("Service", "Hilltop")
        .queryParam("Request", "GetData")
        .queryParam("Site", siteId)
        .queryParam("Measurement", measurementName)
        .queryParam("from", month.atDay(1).atStartOfDay())
        .queryParam("to", month.plusMonths(1).atDay(1).atStartOfDay().minusSeconds(1))
        .build()
        .toASCIIString()
