package nz.govt.eop.freshwater_management_units.services

import java.time.LocalDateTime
import java.util.*
import nz.govt.eop.freshwater_management_units.models.SystemValue
import nz.govt.eop.freshwater_management_units.repositories.SystemValueRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.*
import org.mockito.MockitoAnnotations

class SystemValueServiceTest {

  @Mock private lateinit var repository: SystemValueRepository

  @InjectMocks private lateinit var service: SystemValueService

  @BeforeEach
  fun setup() {
    MockitoAnnotations.openMocks(this)
  }

  @Test
  fun `getValue should return value when it exists`() {
    // Arrange
    val councilId = 9
    val valueName = "test.value"
    val expectedValue = mapOf("key" to "value")
    val systemValue =
        SystemValue(
            id = 1L,
            councilId = councilId,
            valueName = valueName,
            valueAsJson = expectedValue,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now())

    `when`(repository.findByValueNameAndCouncilId(valueName, councilId))
        .thenReturn(Optional.of(systemValue))

    // Act
    val result = service.getValue(valueName, councilId)

    // Assert
    assertEquals(expectedValue, result)
    verify(repository).findByValueNameAndCouncilId(valueName, councilId)
  }

  @Test
  fun `getValue should return null when value does not exist`() {
    // Arrange
    val councilId = 9
    val valueName = "nonexistent.value"

    `when`(repository.findByValueNameAndCouncilId(valueName, councilId))
        .thenReturn(Optional.empty())

    // Act
    val result = service.getValue(valueName, councilId)

    // Assert
    assertNull(result)
    verify(repository).findByValueNameAndCouncilId(valueName, councilId)
  }

  @Test
  fun `setValue should update existing value if it exists`() {
    // Arrange
    val councilId = 9
    val valueName = "test.value"
    val newValue = mapOf("key" to "newValue")
    val existingSystemValue =
        SystemValue(
            id = 1L,
            councilId = councilId,
            valueName = valueName,
            valueAsJson = mapOf("key" to "oldValue"),
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now())

    `when`(repository.findByValueNameAndCouncilId(valueName, councilId))
        .thenReturn(Optional.of(existingSystemValue))

    // Act
    service.setValue(valueName, newValue, councilId)

    // Assert
    assertEquals(newValue, existingSystemValue.valueAsJson)
    verify(repository).save(existingSystemValue)
  }

  @Test
  fun `setValue should create new value if it does not exist`() {
    // Arrange
    val councilId = 9
    val valueName = "new.value"
    val newValue = mapOf("key" to "newValue")

    `when`(repository.findByValueNameAndCouncilId(valueName, councilId))
        .thenReturn(Optional.empty())

    // Act
    service.setValue(valueName, newValue, councilId)

    // Assert
    verify(repository)
        .save(
            argThat<SystemValue> {
              it.councilId == councilId && it.valueName == valueName && it.valueAsJson == newValue
            })
  }
}
