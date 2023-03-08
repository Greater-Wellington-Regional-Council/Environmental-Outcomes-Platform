package nz.govt.eop.ingestapi

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Component

@Component
class APIUserService(@Value("\${ingestApi.usersJSON}") private val usersJSON: String) :
    UserDetailsService {

  private val logger = KotlinLogging.logger {}
  // username is key, API Token is value
  private val users: HashMap<String, String>

  init {
    logger.info { "Parsing users from usersJSON" }
    val mapper = jacksonObjectMapper()
    users = mapper.readValue(usersJSON)
    logger.info { "${users.size} user(s) parsed" }
  }

  override fun loadUserByUsername(username: String): UserDetails {
    val apiToken = users.get(username)
    if (apiToken == null) throw UsernameNotFoundException("$username is not a known user")

    return User.withDefaultPasswordEncoder()
        .username(username)
        .password(apiToken)
        .roles("USER")
        .build()
  }
}
