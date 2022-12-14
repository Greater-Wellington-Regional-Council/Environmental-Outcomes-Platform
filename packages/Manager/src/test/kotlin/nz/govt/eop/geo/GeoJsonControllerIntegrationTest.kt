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
  fun `can load rivers`() {
    mvc.perform(get("/layers/rivers").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
  }
}
