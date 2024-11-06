package nz.govt.eop.ingest.config

import nz.govt.eop.ingest.ApplicationConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.web.SecurityFilterChain
import org.springframework.stereotype.Component

@Configuration
@EnableWebSecurity
class SecurityConfig {
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/actuator/health").permitAll()
                    .anyRequest().authenticated()
            }
            .httpBasic { }
            .csrf { }

        return http.build()
    }
}

@Component
class APIUserDetailsService(val applicationConfiguration: ApplicationConfiguration) :
    UserDetailsService {

  override fun loadUserByUsername(username: String): UserDetails {

    val user =
        applicationConfiguration.users.firstOrNull { it.username == username }
            ?: throw UsernameNotFoundException("$username is not a known user")

    return User.withUsername(username).password(user.token).roles("USER").build()
  }
}
