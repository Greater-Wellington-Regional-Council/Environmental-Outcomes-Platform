package nz.govt.eop.ingestapi

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig(@Value("\${ingestApi.usersJSON}") private val usersJSON: String) {
  @Bean
  fun filterChain(http: HttpSecurity): SecurityFilterChain {
    http
        .authorizeHttpRequests()
        .requestMatchers("/actuator/health")
        .permitAll()
        .anyRequest()
        .authenticated()
        .and()
        .httpBasic()
    http.csrf().disable()
    return http.build()
  }

  @Bean fun customUserDetailsService() = APIUserService(usersJSON = usersJSON)
}
