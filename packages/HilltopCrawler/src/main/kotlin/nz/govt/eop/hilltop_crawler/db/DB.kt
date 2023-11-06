package nz.govt.eop.hilltop_crawler.db

import com.fasterxml.jackson.databind.ObjectMapper
import java.net.URI
import java.sql.ResultSet
import java.time.Instant
import java.time.OffsetDateTime
import java.time.ZoneOffset
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component

enum class HilltopFetchTaskType {
  SITES_LIST,
  MEASUREMENTS_LIST,
  MEASUREMENT_DATA,
  MEASUREMENT_DATA_LATEST,
}

@Component
class DB(val template: JdbcTemplate, val objectMapper: ObjectMapper) {

  data class HilltopSourcesRow(
      val id: Int,
      val councilId: Int,
      val htsUrl: String,
      val config: HilltopSourceConfig
  )

  data class HilltopSourceConfig(
      val measurementNames: List<String>,
      val excludedSitesNames: List<String> = listOf()
  )

  data class HilltopFetchTaskCreate(
      val sourceId: Int,
      val requestType: HilltopFetchTaskType,
      val baseUrl: String,
  )

  data class HilltopFetchTaskRow(
      val id: Int,
      val sourceId: Int,
      val requestType: HilltopFetchTaskType,
      val nextFetchAt: Instant,
      val fetchUri: URI,
      val previousDataHash: String?,
  )

  data class HilltopFetchResult(val at: Instant, val result: HilltopFetchStatus, val hash: String?)

  enum class HilltopFetchStatus {
    SUCCESS,
    UNCHANGED,
    FETCH_ERROR,
    HILLTOP_ERROR,
    PARSE_ERROR,
    UNKNOWN_ERROR
  }

  val hilltopSourcesRowMapper: (rs: ResultSet, rowNum: Int) -> HilltopSourcesRow = { rs, _ ->
    HilltopSourcesRow(
        rs.getInt("id"),
        rs.getInt("council_id"),
        rs.getString("hts_url"),
        objectMapper.readValue(rs.getString("configuration"), HilltopSourceConfig::class.java))
  }

  fun getSource(id: Int): HilltopSourcesRow =
      template.queryForObject(
          """
        SELECT id, council_id, hts_url, configuration
        FROM hilltop_sources
        WHERE id = ?
        """
              .trimIndent(),
          hilltopSourcesRowMapper,
          id,
      )!!

  fun listSources(): List<HilltopSourcesRow> {

    return template.query(
        """
          SELECT id, council_id, hts_url, configuration
          FROM hilltop_sources
          ORDER BY id
          """
            .trimIndent(),
        hilltopSourcesRowMapper)
  }

  fun createFetchTask(request: HilltopFetchTaskCreate) {
    template.update(
        """
        INSERT INTO hilltop_fetch_tasks (source_id, request_type, fetch_url) VALUES (?,?,?)
        ON CONFLICT(source_id, request_type, fetch_url) DO NOTHING 
        """
            .trimIndent(),
        request.sourceId,
        request.requestType.toString(),
        request.baseUrl)
  }

  fun getNextTaskToProcess(): HilltopFetchTaskRow? =
      template
          .query(
              """
        SELECT id, source_id, request_type, next_fetch_at, fetch_url, previous_data_hash
        FROM hilltop_fetch_tasks
        WHERE next_fetch_at < NOW()
        ORDER BY next_fetch_at, id
        LIMIT 1
        FOR UPDATE SKIP LOCKED
        """
                  .trimIndent()) { rs, _ ->
                HilltopFetchTaskRow(
                    rs.getInt("id"),
                    rs.getInt("source_id"),
                    HilltopFetchTaskType.valueOf(rs.getString("request_type")),
                    rs.getTimestamp("next_fetch_at").toInstant(),
                    URI(rs.getString("fetch_url")),
                    rs.getString("previous_data_hash"))
              }
          .firstOrNull()

  fun requeueTask(
      id: Int,
      currentContentHash: String?,
      currentResult: HilltopFetchResult,
      nextFetchAt: Instant
  ) {
    template.update(
        """
          UPDATE hilltop_fetch_tasks
          SET previous_data_hash = ?, 
              previous_history = jsonb_path_query_array(previous_history, '$[last-49 to last]') || ?::jsonb,    
              next_fetch_at = ?
          WHERE id = ?
          """
            .trimIndent(),
        currentContentHash,
        objectMapper.writeValueAsString(currentResult),
        OffsetDateTime.ofInstant(nextFetchAt, ZoneOffset.UTC),
        id)
  }
}
