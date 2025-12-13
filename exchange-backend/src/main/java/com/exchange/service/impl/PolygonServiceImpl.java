package com.exchange.service.impl;

import com.exchange.dto.response.PriceResponse;
import com.exchange.service.PolygonService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class PolygonServiceImpl implements PolygonService {

    private final WebClient webClient;
    private final String apiKey;

    public PolygonServiceImpl(
            @Qualifier("polygonWebClient") WebClient webClient,
            @Value("${app.polygon.api-key}") String apiKey) {
        this.webClient = webClient;
        this.apiKey = apiKey;
    }

    @Override
    public PriceResponse getStockQuote(String symbol) {
        try {
            log.debug("Fetching Polygon quote for {}", symbol);

            // Use Previous Close endpoint (works on free tier)
            @SuppressWarnings("unchecked")
            Map<String, Object> response = webClient.get()
                    .uri("/v2/aggs/ticker/{symbol}/prev?apiKey={apiKey}", symbol.toUpperCase(), apiKey)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) {
                throw new RuntimeException("No response from Polygon API for " + symbol);
            }

            String status = (String) response.get("status");
            // "DELAYED" is valid for free tier (15-min delayed data)
            if (!"OK".equals(status) && !"DELAYED".equals(status)) {
                log.warn("Polygon API returned status: {} for {}", status, symbol);
                throw new RuntimeException("Polygon API error for " + symbol);
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
            if (results == null || results.isEmpty()) {
                throw new RuntimeException("No price data available for " + symbol);
            }

            Map<String, Object> bar = results.get(0);

            BigDecimal close = toBigDecimal(bar.get("c"));
            BigDecimal open = toBigDecimal(bar.get("o"));
            BigDecimal high = toBigDecimal(bar.get("h"));
            BigDecimal low = toBigDecimal(bar.get("l"));
            Long volume = toLong(bar.get("v"));

            // The /prev endpoint returns the previous trading day's aggregated bar
            // We're using that day's close as the current price (free tier limitation)
            // To get the true previous close (close of day before previous), fetch from historical data
            BigDecimal previousClose = null;
            try {
                // Fetch 2 days of historical data to get the day-before's close
                java.time.LocalDate today = java.time.LocalDate.now();
                java.time.LocalDate twoDaysAgo = today.minusDays(2);
                String dateStr = twoDaysAgo.format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                
                @SuppressWarnings("unchecked")
                Map<String, Object> histResponse = webClient.get()
                        .uri("/v2/aggs/ticker/{symbol}/range/1/day/{from}/{to}?apiKey={apiKey}&limit=2",
                                symbol.toUpperCase(), dateStr, dateStr, apiKey)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();
                
                if (histResponse != null && ("OK".equals(histResponse.get("status")) || "DELAYED".equals(histResponse.get("status")))) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> histResults = (List<Map<String, Object>>) histResponse.get("results");
                    if (histResults != null && histResults.size() >= 2) {
                        // Get the earlier day's close (day before previous)
                        Map<String, Object> earlierBar = histResults.get(0);
                        previousClose = toBigDecimal(earlierBar.get("c"));
                    }
                }
            } catch (Exception e) {
                log.debug("Could not fetch historical data for previous close: {}", e.getMessage());
            }
            
            // Fallback: if we couldn't get historical data, use previous day's open as approximation
            // (This is not ideal but better than using close which would make change = 0)
            if (previousClose == null) {
                previousClose = open;
                log.debug("Using previous day's open as approximation for previous close (historical fetch failed)");
            }
            
            // Calculate change from previous close to current price (previous day's close)
            BigDecimal change = close.subtract(previousClose);
            BigDecimal changePercent = previousClose.compareTo(BigDecimal.ZERO) > 0
                    ? change.divide(previousClose, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                    : BigDecimal.ZERO;

            Long timestamp = bar.get("t") != null ? ((Number) bar.get("t")).longValue() : System.currentTimeMillis();

            return PriceResponse.builder()
                    .symbol(symbol.toUpperCase())
                    .price(close)
                    .open(open)
                    .high(high)
                    .low(low)
                    .previousClose(previousClose)
                    .change(change)
                    .changePercent(changePercent)
                    .volume(volume)
                    .timestamp(LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), ZoneId.systemDefault()))
                    .build();

        } catch (WebClientResponseException e) {
            log.error("Polygon API error for {}: {} - {}", symbol, e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to fetch stock quote: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Error fetching Polygon quote for {}: {}", symbol, e.getMessage());
            throw new RuntimeException("Failed to fetch stock quote: " + e.getMessage(), e);
        }
    }

    @Override
    public List<PriceResponse> getHistoricalData(String symbol, int multiplier, String timespan, String from, String to) {
        try {
            log.debug("Fetching Polygon historical data for {} from {} to {}", symbol, from, to);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = webClient.get()
                    .uri("/v2/aggs/ticker/{symbol}/range/{multiplier}/{timespan}/{from}/{to}?apiKey={apiKey}&limit=5000",
                            symbol.toUpperCase(), multiplier, timespan, from, to, apiKey)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) {
                log.warn("No response from Polygon historical API for {}", symbol);
                return new ArrayList<>();
            }

            String status = (String) response.get("status");
            // "DELAYED" is valid for free tier (15-min delayed data)
            if (!"OK".equals(status) && !"DELAYED".equals(status)) {
                log.warn("Polygon historical API returned unexpected status '{}' for {}", status, symbol);
                return new ArrayList<>();
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
            if (results == null || results.isEmpty()) {
                log.info("No historical data available for {} from {} to {}", symbol, from, to);
                return new ArrayList<>();
            }

            List<PriceResponse> prices = new ArrayList<>();
            for (Map<String, Object> bar : results) {
                BigDecimal close = toBigDecimal(bar.get("c"));
                BigDecimal open = toBigDecimal(bar.get("o"));
                BigDecimal high = toBigDecimal(bar.get("h"));
                BigDecimal low = toBigDecimal(bar.get("l"));
                Long volume = toLong(bar.get("v"));
                Long timestamp = bar.get("t") != null ? ((Number) bar.get("t")).longValue() : 0L;

                prices.add(PriceResponse.builder()
                        .symbol(symbol.toUpperCase())
                        .price(close)
                        .open(open)
                        .high(high)
                        .low(low)
                        .volume(volume)
                        .timestamp(LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), ZoneId.systemDefault()))
                        .build());
            }

            log.debug("Fetched {} historical data points for {}", prices.size(), symbol);
            return prices;

        } catch (WebClientResponseException e) {
            if (e.getStatusCode().value() == 403) {
                log.warn("Polygon historical data requires subscription for {}", symbol);
                return new ArrayList<>();
            }
            if (e.getStatusCode().value() == 429) {
                log.warn("Polygon API rate limit exceeded for {}", symbol);
                return new ArrayList<>();
            }
            log.error("Polygon historical API error for {}: {}", symbol, e.getMessage());
            return new ArrayList<>();
        } catch (Exception e) {
            log.error("Error fetching Polygon historical data for {}: {}", symbol, e.getMessage());
            return new ArrayList<>();
        }
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) return BigDecimal.ZERO;
        if (value instanceof BigDecimal) return (BigDecimal) value;
        if (value instanceof Number) return BigDecimal.valueOf(((Number) value).doubleValue());
        return new BigDecimal(value.toString());
    }

    private Long toLong(Object value) {
        if (value == null) return 0L;
        if (value instanceof Long) return (Long) value;
        if (value instanceof Number) return ((Number) value).longValue();
        try {
            return Long.parseLong(value.toString());
        } catch (NumberFormatException e) {
            return 0L;
        }
    }
}

