package nz.govt.eop.plan_limits

import java.time.LocalDate
import org.hamcrest.Matchers.containsString
import org.junit.jupiter.api.Test
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class DetailedWaterUsageTest(@Autowired val mvc: MockMvc) {

  @MockBean private lateinit var queries: Queries

  @Test
  fun `accepts request for 52 weeks of water usage data`() {
    // mock db query
    `when`(queries.waterUsage(9, LocalDate.of(2022, 1, 1), LocalDate.of(2022, 12, 31), null))
        .thenReturn("[]")
    mvc.perform(
            get("/plan-limits/water-usage?councilId=9&from=2022-01-01&to=2022-12-31")
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }

  @Test
  fun `fails for 366 days over a non-leap year`() {
    `when`(queries.waterUsage(9, LocalDate.of(2022, 1, 1), LocalDate.of(2023, 1, 1), null))
        .thenReturn("[]")
    mvc.perform(
            get("/plan-limits/water-usage?councilId=9&from=2022-01-01&to=2023-01-01")
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest)
        .andExpect(content().string(containsString("The duration between")))
  }

  @Test
  fun `succeeds for 366 on leap year`() {
    `when`(queries.waterUsage(9, LocalDate.of(2024, 1, 1), LocalDate.of(2024, 12, 31), null))
        .thenReturn("[]")
    mvc.perform(
            get("/plan-limits/water-usage?councilId=9&from=2024-01-01&to=2024-12-31")
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }
}
