package nz.govt.eop.freshwater_management_units.controllers

import io.kotest.core.spec.style.FunSpec
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class OrgControllerTest(
    @Autowired val mvc: MockMvc,
) : FunSpec() {
  @Test
  fun `Get organisation contact details`() {
    mvc.perform(
            MockMvcRequestBuilders.get("/org/contact-details")
                .contentType(MediaType.APPLICATION_JSON),
        )
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("org-contact-email-missing"))
        .andReturn()
  }
}
