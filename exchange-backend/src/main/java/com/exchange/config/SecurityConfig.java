package com.exchange.config;

import com.exchange.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security Configuration
 * Configures JWT authentication, CORS, and endpoint security.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // TODO: Configure security filter chain
        // - Disable CSRF for REST API
        // - Configure CORS
        // - Set stateless session management
        // - Configure endpoint authorization rules
        // - Add JWT authentication filter
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        // TODO: Configure authentication provider with UserDetailsService and PasswordEncoder
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        // TODO: Return authentication manager
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // TODO: Return BCrypt password encoder
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
