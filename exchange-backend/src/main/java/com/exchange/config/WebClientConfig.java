package com.exchange.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * WebClient Configuration
 * Configures WebClient instances for external API calls.
 */
@Configuration
public class WebClientConfig {

    @Value("${app.finnhub.base-url}")
    private String finnhubBaseUrl;

    @Value("${app.coinbase.base-url}")
    private String coinbaseBaseUrl;

    @Bean
    public WebClient finnhubWebClient() {
        return WebClient.builder()
                .baseUrl(finnhubBaseUrl)
                .build();
    }

    @Bean
    public WebClient coinbaseWebClient() {
        return WebClient.builder()
                .baseUrl(coinbaseBaseUrl)
                .build();
    }
}