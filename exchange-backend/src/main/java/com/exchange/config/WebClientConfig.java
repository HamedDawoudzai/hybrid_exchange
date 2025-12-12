package com.exchange.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * WebClient Configuration
 * Configures WebClient instances for external API calls.
 */
@Configuration
public class WebClientConfig {

    @Bean
    public WebClient finnhubWebClient() {
        // TODO: Configure WebClient for Finnhub API
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Bean
    public WebClient coinbaseWebClient() {
        // TODO: Configure WebClient for Coinbase API
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
