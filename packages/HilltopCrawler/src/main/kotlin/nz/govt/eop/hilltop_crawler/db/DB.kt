package nz.govt.eop.hilltop_crawler.db

import java.time.Instant
import java.time.OffsetDateTime
import java.time.ZoneOffset
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component

@Component
class DB(val template: JdbcTemplate) {

  enum class HilltopFetchTaskState {
    PENDING,
  }

  enum class HilltopFetchTaskRequestType {
    SITES_LIST,
    MEASUREMENTS_LIST,
    MEASUREMENT_DATA
  }

  data class HilltopSourcesRow(val councilId: Int, val htsUrl: String)

  data class HilltopFetchTaskCreate(
      val councilId: Int,
      val requestType: HilltopFetchTaskRequestType,
      val baseUrl: String,
      val queryParams: String,
      val state: HilltopFetchTaskState
  )

  data class HilltopFetchTaskRow(
      val id: Int,
      val councilId: Int,
      val requestType: HilltopFetchTaskRequestType,
      val baseUrl: String,
      val queryParams: String,
      val state: HilltopFetchTaskState,
      val previousDataHash: String?
  )

  fun listSources(): List<HilltopSourcesRow> =
      template.query(
          """
        SELECT council_id, hts_url
        FROM hilltop_sources
        """
              .trimIndent()) { rs, _ ->
            HilltopSourcesRow(rs.getInt("council_id"), rs.getString("hts_url"))
          }

  fun createFetchTask(request: HilltopFetchTaskCreate) {
    template.update(
        """
        INSERT INTO hilltop_fetch_tasks (council_id, request_type, base_url, query_params, state) VALUES (?,?,?,?,?)
        ON CONFLICT DO NOTHING 
        """
            .trimIndent(),
        request.councilId,
        request.requestType.toString(),
        request.baseUrl,
        request.queryParams,
        request.state.toString())
  }

  fun getNextTaskToProcess(): HilltopFetchTaskRow? =
      template
          .query(
              """
        SELECT id, council_id, request_type, base_url, query_params, state, previous_data_hash
        FROM hilltop_fetch_tasks
        WHERE state = 'PENDING' AND next_fetch_at < NOW()
        ORDER BY next_fetch_at 
        LIMIT 1
        """
                  .trimIndent()) { rs, _ ->
                HilltopFetchTaskRow(
                    rs.getInt("id"),
                    rs.getInt("council_id"),
                    HilltopFetchTaskRequestType.valueOf(rs.getString("request_type")),
                    rs.getString("base_url"),
                    rs.getString("query_params"),
                    HilltopFetchTaskState.valueOf(rs.getString("state")),
                    rs.getString("previous_data_hash"),
                )
              }
          .firstOrNull()

  fun requeueTask(id: Int, currentContentHash: String, nextFetchAt: Instant) {
    template.update(
        """
          UPDATE hilltop_fetch_tasks
          SET state = 'PENDING', previous_data_hash = ?, next_fetch_at = ?
          WHERE id = ?
          """
            .trimIndent(),
        currentContentHash,
        OffsetDateTime.ofInstant(nextFetchAt, ZoneOffset.UTC),
        id)
  }
}
