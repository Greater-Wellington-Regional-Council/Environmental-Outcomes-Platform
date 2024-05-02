package nz.govt.eop.freshwater_management_units.repositories

import nz.govt.eop.freshwater_management_units.models.TangataWhenuaSite
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface TangataWhenuaSiteRepository : CrudRepository<TangataWhenuaSite, Int> {
    @Query("SELECT t FROM tangata_whenua_sites t WHERE ST_Intersects(t.geom, :boundary) = true", nativeQuery = true)
    fun findAllIntersectingWithBoundary(
        @Param("boundary") boundary: String,
    ): Set<TangataWhenuaSite>
}
