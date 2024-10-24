package nz.govt.eop.freshwater_management_units.repositories

import nz.govt.eop.freshwater_management_units.models.TangataWhenuaSite
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
interface TangataWhenuaSiteRepository : CrudRepository<TangataWhenuaSite, Int> {
  @Query(
      """
        SELECT t.*,
               ST_AsGeoJSON(ST_Transform(t.geom, 4326), 6, 2) AS geomGeoJson
        FROM tangata_whenua_sites t
        WHERE ST_Intersects(t.geom, ST_Transform(ST_GeomFromGeoJSON(:boundary), 4326))
        """,
      nativeQuery = true,
  )
  fun findAllIntersectingWith(
      @Param("boundary") boundary: String,
  ): List<TangataWhenuaSite>

  @Modifying
  @Transactional
  @Query(
      value =
          """
            INSERT INTO tangata_whenua_sites (location, location_values, geom)
            VALUES (:location, :location_values, ST_GeomFromGeoJSON(:geom))
        """,
      nativeQuery = true,
  )
  fun saveWithGeom(
      @Param("location") location: String?,
      @Param("location_values") locationValues: List<String>?,
      @Param("geom") geom: String,
  )
}
