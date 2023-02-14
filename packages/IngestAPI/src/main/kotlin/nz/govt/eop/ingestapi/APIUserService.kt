package nz.govt.eop.ingestapi

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import mu.KotlinLogging
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException

data class APIUser(var id: String, var token: String)

class APIUserService(private val usersJSON: String) : UserDetailsService {

  private val logger = KotlinLogging.logger {}
  private val users: List<APIUser>

  init {
    logger.info { "Parsing api users from usersJSON" }
    val mapper = jacksonObjectMapper()
    users = mapper.readValue(usersJSON)
    logger.info { "${users.count()} api users parsed" }
  }

  override fun loadUserByUsername(username: String): UserDetails {
    val user = users.find { it.id == username }
    if (user == null) throw UsernameNotFoundException("$username is not a known user")

    return User.withDefaultPasswordEncoder()
        .username(user.id)
        .password(user.token)
        .roles("USER")
        .build()
  }
}
