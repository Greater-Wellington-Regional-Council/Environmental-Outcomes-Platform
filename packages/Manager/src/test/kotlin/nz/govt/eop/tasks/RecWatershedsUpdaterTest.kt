package nz.govt.eop.tasks

import io.kotest.matchers.shouldBe
import io.kotest.matchers.types.shouldBeInstanceOf
import java.time.LocalDateTime
import nz.govt.eop.si.jooq.tables.RawRecFeaturesWatersheds.Companion.RAW_REC_FEATURES_WATERSHEDS
import nz.govt.eop.si.jooq.tables.Watersheds.Companion.WATERSHEDS
import org.jooq.DSLContext
import org.jooq.JSONB
import org.jooq.impl.DSL
import org.json.JSONObject
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@SpringBootTest
@ActiveProfiles("test")
class RecWatershedsUpdaterTest(
    @Autowired val recWatershedsUpdater: RecWatershedsUpdater,
    @Autowired val context: DSLContext
) {

  val defaultRawData =
      mapOf(
          "type" to "Feature",
          "geometry" to
              mapOf(
                  "type" to "MultiLineString",
                  "coordinates" to
                      arrayOf(
                          arrayOf(
                              arrayOf(176.1042737260001, -40.67333901599994),
                              arrayOf(176.10533746800002, -40.673310482999966),
                              arrayOf(176.10717287300008, -40.67461275499994)))),
          "properties" to mapOf("HydroID" to 2, "nzsegment" to 123456))

  @Test
  fun `should insert records when WATERSHEDS table is empty`() {
    // GIVEN
    context.truncate(RAW_REC_FEATURES_WATERSHEDS).execute()
    context.truncate(WATERSHEDS).execute()

    context
        .insertInto(RAW_REC_FEATURES_WATERSHEDS)
        .columns(RAW_REC_FEATURES_WATERSHEDS.DATA)
        .values(JSONB.valueOf(JSONObject(defaultRawData).toString()))
        .execute()

    // WHEN
    recWatershedsUpdater.checkWatersheds()

    // THEN
    val first = context.select(DSL.count()).from(WATERSHEDS).first()
    first["count"].shouldBeInstanceOf<Int>().shouldBe(1)

    val record = context.selectFrom(WATERSHEDS).first()
    record.hydroId.shouldBe(2)
    record.nzSegment.shouldBe(123456)
  }

  @Test
  fun `should do nothing when last record in WATERSHEDS table was created after last raw table ingest`() {
    // GIVEN
    context.truncate(RAW_REC_FEATURES_WATERSHEDS).execute()
    context.truncate(WATERSHEDS).execute()

    context
        .insertInto(RAW_REC_FEATURES_WATERSHEDS)
        .columns(RAW_REC_FEATURES_WATERSHEDS.DATA)
        .values(JSONB.valueOf(JSONObject(defaultRawData).toString()))
        .execute()

    context
        .insertInto(WATERSHEDS)
        .values(
            1,
            1,
            DSL.field("ST_GeomFromText('POINT(0 0)')"),
            LocalDateTime.parse("2099-01-01T00:00"))
        .execute()

    // WHEN
    recWatershedsUpdater.checkWatersheds()

    // THEN
    val first = context.select(DSL.count()).from(WATERSHEDS).first()
    first["count"].shouldBeInstanceOf<Int>().shouldBe(1)

    val record = context.selectFrom(WATERSHEDS).first()
    record.createdAt.shouldBe(LocalDateTime.parse("2099-01-01T00:00"))
  }

  @Test
  fun `should update WATERSHEDS table last record in WATERSHEDS table was created before last raw table ingest`() {
    // GIVEN
    context.truncate(RAW_REC_FEATURES_WATERSHEDS).execute()
    context.truncate(WATERSHEDS).execute()

    context
        .insertInto(RAW_REC_FEATURES_WATERSHEDS)
        .columns(RAW_REC_FEATURES_WATERSHEDS.DATA)
        .values(JSONB.valueOf(JSONObject(defaultRawData).toString()))
        .execute()

    context
        .insertInto(WATERSHEDS)
        .values(
            1,
            1,
            DSL.field("ST_GeomFromText('POINT(0 0)')"),
            LocalDateTime.parse("2000-01-01T00:00"))
        .execute()

    // WHEN
    recWatershedsUpdater.checkWatersheds()

    // THEN
    val first = context.select(DSL.count()).from(WATERSHEDS).first()
    first["count"].shouldBeInstanceOf<Int>().shouldBe(1)

    val record = context.selectFrom(WATERSHEDS).first()
    record.hydroId.shouldBe(2)
    record.nzSegment.shouldBe(123456)
  }
}
