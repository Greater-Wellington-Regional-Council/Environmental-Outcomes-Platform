package nz.govt.eop.tasks

import io.kotest.matchers.shouldBe
import io.kotest.matchers.types.shouldBeInstanceOf
import java.time.LocalDateTime
import nz.govt.eop.si.jooq.tables.RawRecFeaturesRivers.Companion.RAW_REC_FEATURES_RIVERS
import nz.govt.eop.si.jooq.tables.RecRiversModifications.Companion.REC_RIVERS_MODIFICATIONS
import nz.govt.eop.si.jooq.tables.Rivers.Companion.RIVERS
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
class RecRiversUpdaterTest(
    @Autowired val recRiversUpdater: RecRiversUpdater,
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
          "properties" to
              mapOf(
                  "HydroID" to 2,
                  "NextDownID" to 1,
                  "nzsegment" to 123456,
                  "StreamOrde" to 3,
                  "Headwater" to 1))

  @Test
  fun `should insert records when rivers table is empty`() {
    // GIVEN
    context.truncate(RAW_REC_FEATURES_RIVERS).execute()
    context.truncate(REC_RIVERS_MODIFICATIONS).execute()
    context.truncate(RIVERS).execute()

    context
        .insertInto(RAW_REC_FEATURES_RIVERS)
        .columns(RAW_REC_FEATURES_RIVERS.DATA)
        .values(JSONB.valueOf(JSONObject(defaultRawData).toString()))
        .execute()

    // WHEN
    recRiversUpdater.checkRivers()

    // THEN
    val first = context.select(DSL.count()).from(RIVERS).first()
    first["count"].shouldBeInstanceOf<Int>().shouldBe(1)

    val record = context.selectFrom(RIVERS).first()
    record.hydroId.shouldBe(2)
    record.nextHydroId.shouldBe(1)
    record.nzSegment.shouldBe(123456)
    record.streamOrder.shouldBe(3)
    record.isHeadwater.shouldBe(true)
  }

  @Test
  fun `should do nothing when last record in rivers table was created after last raw table ingest`() {
    // GIVEN
    context.truncate(RAW_REC_FEATURES_RIVERS).execute()
    context.truncate(REC_RIVERS_MODIFICATIONS).execute()
    context.truncate(RIVERS).execute()

    context
        .insertInto(RAW_REC_FEATURES_RIVERS)
        .columns(RAW_REC_FEATURES_RIVERS.DATA)
        .values(JSONB.valueOf(JSONObject(defaultRawData).toString()))
        .execute()

    context
        .insertInto(RIVERS)
        .values(
            1,
            1,
            1,
            false,
            1,
            DSL.field("ST_GeomFromText('POINT(0 0)')"),
            LocalDateTime.parse("2099-01-01T00:00"))
        .execute()

    // WHEN
    recRiversUpdater.checkRivers()

    // THEN
    val first = context.select(DSL.count()).from(RIVERS).first()
    first["count"].shouldBeInstanceOf<Int>().shouldBe(1)

    val record = context.selectFrom(RIVERS).first()
    record.createdAt.shouldBe(LocalDateTime.parse("2099-01-01T00:00"))
  }

  @Test
  fun `should update rivers table last record in rivers table was created before last raw table ingest`() {
    // GIVEN
    context.truncate(RAW_REC_FEATURES_RIVERS).execute()
    context.truncate(REC_RIVERS_MODIFICATIONS).execute()
    context.truncate(RIVERS).execute()

    context
        .insertInto(RAW_REC_FEATURES_RIVERS)
        .columns(RAW_REC_FEATURES_RIVERS.DATA)
        .values(JSONB.valueOf(JSONObject(defaultRawData).toString()))
        .execute()

    context
        .insertInto(RIVERS)
        .values(
            1,
            1,
            1,
            false,
            1,
            DSL.field("ST_GeomFromText('POINT(0 0)')"),
            LocalDateTime.parse("2000-01-01T00:00"))
        .execute()

    // WHEN
    recRiversUpdater.checkRivers()

    // THEN
    val first = context.select(DSL.count()).from(RIVERS).first()
    first["count"].shouldBeInstanceOf<Int>().shouldBe(1)

    val record = context.selectFrom(RIVERS).first()
    record.hydroId.shouldBe(2)
    record.nextHydroId.shouldBe(1)
    record.nzSegment.shouldBe(123456)
    record.streamOrder.shouldBe(3)
    record.isHeadwater.shouldBe(true)
  }

  @Test
  fun `should include rows from the rec river modifications table before the raw rec rivers`() {
    // GIVEN
    context.truncate(RAW_REC_FEATURES_RIVERS).execute()
    context.truncate(REC_RIVERS_MODIFICATIONS).execute()
    context.truncate(RIVERS).execute()

    context
        .insertInto(
            REC_RIVERS_MODIFICATIONS,
            REC_RIVERS_MODIFICATIONS.HYDRO_ID,
            REC_RIVERS_MODIFICATIONS.IS_HEADWATER,
            REC_RIVERS_MODIFICATIONS.NEXT_HYDRO_ID,
            REC_RIVERS_MODIFICATIONS.NZ_SEGMENT,
            REC_RIVERS_MODIFICATIONS.STREAM_ORDER,
            REC_RIVERS_MODIFICATIONS.GEOM,
            REC_RIVERS_MODIFICATIONS.CREATED_AT,
            REC_RIVERS_MODIFICATIONS.COMMENT)
        .values(
            DSL.value(2),
            DSL.value(false),
            DSL.value(3),
            DSL.value(654321),
            DSL.value(4),
            DSL.field("ST_GeomFromText('POINT(0 0)')", ByteArray::class.java),
            DSL.value(LocalDateTime.now()),
            DSL.value("TEST DATA"))
        .execute()

    context
        .insertInto(RAW_REC_FEATURES_RIVERS)
        .columns(RAW_REC_FEATURES_RIVERS.DATA)
        .values(JSONB.valueOf(JSONObject(defaultRawData).toString()))
        .execute()

    // WHEN
    recRiversUpdater.checkRivers()

    // THEN
    val first = context.select(DSL.count()).from(RIVERS).first()
    first["count"].shouldBeInstanceOf<Int>().shouldBe(1)

    val record = context.selectFrom(RIVERS).first()
    record.hydroId.shouldBe(2)
    record.nextHydroId.shouldBe(3)
    record.nzSegment.shouldBe(654321)
    record.streamOrder.shouldBe(4)
    record.isHeadwater.shouldBe(false)
  }
}
