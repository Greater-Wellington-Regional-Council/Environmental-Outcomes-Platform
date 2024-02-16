package nz.govt.eop.plan_limits

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class ControllerIntegrationTest(@Autowired val mvc: MockMvc) {

    @Test
  fun `can load councils`() {
    mvc.perform(get("/plan-limits/councils").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }

  @Test
  fun `can load manifest`() {
    mvc.perform(get("/plan-limits/manifest?councilId=9").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }

  @Test
  fun `can load plan`() {
    mvc.perform(get("/plan-limits/plan?councilId=9").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }

  @Test
  fun `can load plan regions`() {
    mvc.perform(
            get("/plan-limits/plan-regions?councilId=9").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }

  @Test
  fun `can load surface water limits`() {
    mvc.perform(
            get("/plan-limits/surface-water-limits?councilId=9")
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }

  @Test
  fun `can load ground water limits`() {
    mvc.perform(
            get("/plan-limits/ground-water-limits?councilId=9")
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }

  @Test
  fun `can load flow management sites`() {
    mvc.perform(
            get("/plan-limits/flow-measurement-sites?councilId=9")
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }

  @Test
  fun `can load flow limits`() {
    mvc.perform(get("/plan-limits/flow-limits?councilId=9").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }
}
