package nz.govt.eop.tasks

import io.kotest.matchers.shouldBe
import io.kotest.matchers.types.shouldBeInstanceOf
import nz.govt.eop.si.jooq.tables.GroundwaterZones.Companion.GROUNDWATER_ZONES
import nz.govt.eop.si.jooq.tables.WhaituaBoundaries.Companion.WHAITUA_BOUNDARIES
import org.geojson.Feature
import org.geojson.FeatureCollection
import org.geojson.LngLatAlt
import org.geojson.MultiPolygon
import org.geojson.Polygon
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@SpringBootTest
@ActiveProfiles("test")
class GisDataFetcherTest(
    @Autowired val gisDataFetcher: GisDataFetcher,
    @Autowired val context: DSLContext
) {

  fun constructTestWhaituaData(): FeatureCollection {

    var geometry = MultiPolygon(Polygon(LngLatAlt(174.90323294337531, -40.88914027923949)))

    var testFeature = Feature()
    testFeature.setProperty("Name", "Kāpiti Whaitua")
    testFeature.setId("5")
    testFeature.setGeometry(geometry)

    var testFeatureCollection = FeatureCollection()
    testFeatureCollection.add(testFeature)

    return testFeatureCollection
  }

  fun constructTestGroundwaterData(): FeatureCollection {

    var geometry = MultiPolygon(Polygon(LngLatAlt(174.90323294337531, -40.88914027923949)))

    var testFeature = Feature()
    testFeature.setProperty("Name", "Middle Ruamāhanga")
    testFeature.setProperty("Category", "Category A")
    testFeature.setProperty("Depth", "0-20 m")
    testFeature.setProperty("Description", "Category A (0-20 m)")
    testFeature.setProperty("Zone", "Middle Wairarapa groundwater management zone")
    testFeature.setProperty("AllocationAmount_Groundwater_ID", 14)
    testFeature.setId("1")
    testFeature.setGeometry(geometry)

    var testFeatureCollection = FeatureCollection()
    testFeatureCollection.add(testFeature)

    println(testFeatureCollection)

    return testFeatureCollection
  }

  @Test
  fun `should insert records when whaitua table is empty`() {

    // GIVEN
    context.truncate(WHAITUA_BOUNDARIES).execute()

    var whaitua_geojson = constructTestWhaituaData()

    // WHEN
    gisDataFetcher.materialiseWhaituaGeoJson(featureCollection = whaitua_geojson)

    // THEN
    val first = context.select(DSL.count()).from(WHAITUA_BOUNDARIES).first()
    first["count"].shouldBeInstanceOf<Int>().shouldBe(1)

    val record = context.selectFrom(WHAITUA_BOUNDARIES).first()
    record.name.shouldBe("Kāpiti Whaitua")
  }

  @Test
  fun `should insert records when groundwater table is empty`() {

    // GIVEN
    context.truncate(GROUNDWATER_ZONES).execute()

    val groundwater_geojson = constructTestGroundwaterData()

    // WHEN
    gisDataFetcher.materialiseGroundwaterGeoJson(groundwater_geojson)

    // THEN
    val first = context.select(DSL.count()).from(GROUNDWATER_ZONES).first()
    first["count"].shouldBeInstanceOf<Int>().shouldBe(1)

    val record = context.selectFrom(GROUNDWATER_ZONES).first()
    record.name.shouldBe("Middle Ruamāhanga")
    record.category.shouldBe("Category A")
    record.depth.shouldBe("0-20 m")
    record.notes.shouldBe("Category A (0-20 m)")
  }
}
