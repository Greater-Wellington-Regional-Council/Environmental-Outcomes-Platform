package nz.govt.eop.utils

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import org.geojson.*

class GeometryDeserializer : JsonDeserializer<Geometry<Any>>() {
  private val mapper = ObjectMapper()

  @Suppress("UNCHECKED_CAST")
  override fun deserialize(p: JsonParser, ctxt: DeserializationContext): Geometry<Any> {
    val node: JsonNode = p.codec.readTree(p)
    return when (val type = node["type"].asText()) {
      "Point" -> mapper.treeToValue(node, Point::class.java) as Geometry<Any>
      "Polygon" -> mapper.treeToValue(node, Polygon::class.java) as Geometry<Any>
      "LineString" -> mapper.treeToValue(node, LineString::class.java) as Geometry<Any>
      "MultiPoint" -> mapper.treeToValue(node, MultiPoint::class.java) as Geometry<Any>
      "MultiPolygon" -> mapper.treeToValue(node, MultiPolygon::class.java) as Geometry<Any>
      "MultiLineString" -> mapper.treeToValue(node, MultiLineString::class.java) as Geometry<Any>
      else -> throw IllegalArgumentException("Unknown geometry type: $type")
    }
  }
}
