package nz.govt.eop.ingest

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.matchers.types.shouldBeInstanceOf
import nz.govt.eop.ingest.config.APIUserDetailsService
import org.junit.jupiter.api.Test
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.test.context.ActiveProfiles

@ActiveProfiles("test")
class APIUserServiceTest {

  @Test
  fun `loadUserByUsername throws a UsernameNotFoundException if the user is not found`() {
    // GIVEN
    val applicationConfiguration =
        ApplicationConfiguration(0, listOf(User("test-user", "test-user-token")))
    val userService = APIUserDetailsService(applicationConfiguration)

    // WHEN / THEN
    shouldThrow<UsernameNotFoundException> {
      userService.loadUserByUsername(username = "not-a-user")
    }
  }

  @Test
  fun `loadUserByUsername returns a User if found`() {
    // GIVEN
    val applicationConfiguration =
        ApplicationConfiguration(0, listOf(User("test-user", "test-user-token")))
    val userService = APIUserDetailsService(applicationConfiguration)

    // WHEN
    val user = userService.loadUserByUsername(username = "test-user")

    // THEN
    user.shouldBeInstanceOf<User>()
  }
}
