package nz.govt.eop.farm_management_units.repositories

import nz.govt.eop.farm_management_units.models.FarmManagementUnit
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface FarmManagementUnitRepository : JpaRepository<FarmManagementUnit, Int> {
  @Query(
      value =
          """
        SELECT 
            99999 as id, 
            gid, 
            objectid, 
            fmu_no, 
            location, 
            fmu_name1, 
            fmu_group, 
            shape_leng, 
            shape_area,  
            by_when,  
            fmu_issue,  
            top_fmugrp,  
            ecoli_base,  
            peri_base,  
            peri_obj,  
            a_tox_base,  
            a_tox_obj,  
            n_tox_base,  
            n_tox_obj,  
            phyto_base,  
            phyto_obj,  
            tn_base,  
            tn_obj,  
            tp_base,  
            tp_obj,  
            tli_base,  
            tli_obj,  
            tss_base,  
            tss_obj,  
            macro_base,  
            macro_obj,  
            mci_base,  
            mci_obj, 
            ecoli_obj, 
            CAST(ST_AsGeoJSON(ST_Transform(geom, 4326), 6 ,2) AS jsonb) as geom 
        FROM farm_management_units 
        WHERE ST_Intersects(geom, ST_Transform(ST_SetSRID(ST_Point(:lng, :lat), :srid), 2193))
    """,
      nativeQuery = true,
  )
  fun findAllByLngLat(
      lng: Double,
      lat: Double,
      srid: Int = FarmManagementUnit.DEFAULT_SRID
  ): List<FarmManagementUnit>
}
