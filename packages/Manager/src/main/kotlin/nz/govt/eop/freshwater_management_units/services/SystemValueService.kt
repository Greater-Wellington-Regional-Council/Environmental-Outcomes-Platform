package nz.govt.eop.freshwater_management_units.services

import java.time.LocalDateTime
import nz.govt.eop.freshwater_management_units.models.SystemValue
import nz.govt.eop.freshwater_management_units.repositories.SystemValueRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class SystemValueService(private val repository: SystemValueRepository) {

  fun getValue(valueName: String, councilId: Int? = null): Map<String, Any>? {
    return repository.findByValueNameAndCouncilId(valueName, councilId).orElse(null)?.valueAsJson
  }

  @Transactional
  fun setValue(valueName: String, value: Map<String, Any>, councilId: Int? = null) {
    val existingValue = repository.findByValueNameAndCouncilId(valueName, councilId)

    if (existingValue.isPresent) {
      val systemValue = existingValue.get()
      systemValue.valueAsJson = value
      systemValue.updatedAt = LocalDateTime.now()
      repository.save(systemValue)
    } else {
      val newValue = SystemValue(councilId = councilId, valueName = valueName, valueAsJson = value)
      repository.save(newValue)
    }
  }
}
