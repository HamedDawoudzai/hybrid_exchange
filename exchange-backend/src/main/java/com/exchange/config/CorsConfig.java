package com.exchange.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * CORS Configuration
 * Configures Cross-Origin Resource Sharing for frontend access.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // TODO: Configure CORS settings
        // - Set allowed origins (localhost:3000 for frontend)
        // - Set allowed methods (GET, POST, PUT, PATCH, DELETE, OPTIONS)
        // - Set allowed headers
        // - Enable credentials
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
