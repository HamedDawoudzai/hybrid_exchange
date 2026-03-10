package com.exchange.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
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

    @Value("${app.polygon.base-url}")
    private String polygonBaseUrl;

    @Value("${app.openai.base-url:https://api.openai.com}")
    private String openaiBaseUrl;

    @Value("${app.openai.api-key:}")
    private String openaiApiKey;

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

    @Bean
    public WebClient polygonWebClient() {
        String baseUrl = Objects.requireNonNull(polygonBaseUrl, "polygonBaseUrl must not be null");
        return WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    @Bean
    public WebClient openaiWebClient() {
        WebClient.Builder builder = WebClient.builder()
                .baseUrl(openaiBaseUrl + "/v1");
        if (openaiApiKey != null && !openaiApiKey.isBlank()) {
            builder.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + openaiApiKey);
        }
        return builder.build();
    }
}