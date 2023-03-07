package nz.govt.eop.ingestapi

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.matchers.types.shouldBeInstanceOf
import org.junit.jupiter.api.Test
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.test.context.ActiveProfiles

@ActiveProfiles("test")
class APIUserServiceTest {

  @Test
  fun `loadUserByUsername throws a UsernameNotFoundException if the user is not found`() {

    val usersJSON = """{"test-user":"test-user-token"}"""
    val userService = APIUserService(usersJSON = usersJSON)
    shouldThrow<UsernameNotFoundException> {
      userService.loadUserByUsername(username = "not-a-user")
    }
  }

  @Test
  fun `loadUserByUsername returns a User if found`() {
    val usersJSON = """{"test-user":"test-user-token"}"""
    val userService = APIUserService(usersJSON = usersJSON)
    val user = userService.loadUserByUsername(username = "test-user")
    user.shouldBeInstanceOf<User>()
  }
}
