package com.exchange.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Objects;

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
        String baseUrl = Objects.requireNonNull(finnhubBaseUrl, "finnhubBaseUrl must not be null");
        return WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    @Bean
    public WebClient coinbaseWebClient() {
        String baseUrl = Objects.requireNonNull(coinbaseBaseUrl, "coinbaseBaseUrl must not be null");
        return WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }
}