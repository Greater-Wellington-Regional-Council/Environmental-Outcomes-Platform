package nz.govt.eop.utils

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import org.geojson.*

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = Point::class, name = "Point"),
    JsonSubTypes.Type(value = Polygon::class, name = "Polygon"),
    JsonSubTypes.Type(value = LineString::class, name = "LineString"),
    JsonSubTypes.Type(value = MultiPoint::class, name = "MultiPoint"),
    JsonSubTypes.Type(value = MultiPolygon::class, name = "MultiPolygon"),
    JsonSubTypes.Type(value = MultiLineString::class, name = "MultiLineString")
)
abstract class GeometryWrapper : Geometry<Any>()