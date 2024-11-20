package nz.govt.eop.freshwater_management_units.repositories

import java.util.Optional
import nz.govt.eop.freshwater_management_units.models.SystemValue
import org.springframework.data.jpa.repository.JpaRepository

interface SystemValueRepository : JpaRepository<SystemValue, Long> {
  fun findByValueNameAndCouncilId(valueName: String, councilId: Int?): Optional<SystemValue>
}
