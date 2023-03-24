package nz.govt.eop.geo

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
class GeoJsonControllerIntegrationTest(@Autowired val mvc: MockMvc) {

  @Test
  fun `can load manifest`() {
    mvc.perform(get("/manifest").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk)
  }

  @Test
  fun `can load councils`() {
    mvc.perform(get("/layers/councils").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }

  @Test
  fun `can load whaitua`() {
    mvc.perform(get("/layers/whaitua").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }

  @Test
  fun `can load surface water management units`() {
    mvc.perform(
            get("/layers/surface-water-management-units").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }

  @Test
  fun `can load surface water management sub units`() {
    mvc.perform(
            get("/layers/surface-water-management-sub-units")
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }

  @Test
  fun `can load flow management sites`() {
    mvc.perform(get("/layers/flow-management-sites").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }

  @Test
  fun `can load flow limits`() {
    mvc.perform(get("/layers/flow-limits").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }

  @Test
  fun `can load groundwater zones`() {
    mvc.perform(get("/layers/groundwater-zones").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }
}
