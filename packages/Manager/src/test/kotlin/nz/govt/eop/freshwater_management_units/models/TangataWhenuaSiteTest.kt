package nz.govt.eop.freshwater_management_units.models

import org.geojson.FeatureCollection
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class TangataWhenuaSiteTest {

    @Test
    fun `significantSites returns locationValues when locationValues is not empty`() {
        val site = TangataWhenuaSite(
            locationValues = listOf("Site A", "Site B"),
            properties = mapOf("Mana_Whenua" to "Whānui Group"),
            sourceName = "Schedule B"
        )

        assertEquals(listOf("Site A", "Site B"), site.significantSites)
    }

    @Test
    fun `significantSites returns non-null maoriPropertyNames values when locationValues is empty`() {
        val site = TangataWhenuaSite(
            locationValues = emptyList(),
            properties = mapOf(
                "Mana_Whenua" to "Whānui Group",
                "Wāhi_Mahara" to "Historic Place",
                "Te_Mahi_Kai" to null
            ),
            sourceName = "Schedule B"
        )

        assertEquals(listOf("Wāhi_Mahara"), site.significantSites)
    }

    @Test
    fun `significantSites returns empty list when locationValues is empty and maoriPropertyNames are all null`() {
        val site = TangataWhenuaSite(
            locationValues = emptyList(),
            properties = mapOf<String, Any?>(
                "Mana_Whenua" to null,
                "Wāhi_Mahara" to null
            ),
            sourceName = "Schedule B"
        )

        assertEquals(emptyList<String>(), site.significantSites)
    }

    @Test
    fun `toFeatureCollection creates correct FeatureCollection from TangataWhenuaSite list`() {
        val site1 = TangataWhenuaSite(
            id = 1,
            location = "Location A",
            locationValues = listOf("Value 1", "Value 2"),
            properties = mapOf("Mana_Whenua" to "Group A"),
            geomGeoJson = """{"type": "Point", "coordinates": [175.0, -40.0]}""",
            sourceName = "Schedule B"
        )
        val site2 = TangataWhenuaSite(
            id = 2,
            location = "Location B",
            locationValues = emptyList(),
            properties = mapOf("Wāhi_Mahara" to "Significant Spot"),
            geomGeoJson = """{"type": "Point", "coordinates": [174.0, -41.0]}""",
            sourceName = "Schedule B"
        )

        val featureCollection: FeatureCollection = listOf(site1, site2).toFeatureCollection()
        val features = featureCollection.features

        assertEquals(2, features.size)
        assertEquals("Location A", features[0].properties["location"])
        assertEquals("Group A", features[0].properties["Mana_Whenua"])
        assertEquals("Location B", features[1].properties["location"])
        assertEquals("Significant Spot", features[1].properties["Wāhi_Mahara"])
    }
}