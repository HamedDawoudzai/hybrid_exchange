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
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class PolygonServiceImpl implements PolygonService {

    private final WebClient polygonWebClient;

    @Value("${app.polygon.api-key}")
    private String apiKey;

    public PolygonServiceImpl(@Qualifier("polygonWebClient") WebClient polygonWebClient) {
        this.polygonWebClient = polygonWebClient;
    }

    @Override
    public PriceResponse getStockQuote(String symbol) {
        try {
            // Use Previous Day endpoint for reliable data (works on free tier)
            // Ticker endpoint: /v2/aggs/ticker/{ticker}/prev
            @SuppressWarnings("unchecked")
            Map<String, Object> response = polygonWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v2/aggs/ticker/{ticker}/prev")
                            .queryParam("apiKey", apiKey)
                            .build(symbol.toUpperCase()))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            String status = (String) response.get("status");
            // Accept both "OK" and "DELAYED" (free tier returns DELAYED for 15-min delayed data)
            if (response == null || (!"OK".equals(status) && !"DELAYED".equals(status))) {
                log.warn("Polygon API returned unexpected status '{}' for {}", status, symbol);
                // Try the snapshot endpoint as fallback
                return getSnapshotQuote(symbol);
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
            if (results == null || results.isEmpty()) {
                log.warn("No results from Polygon for {}", symbol);
                return getSnapshotQuote(symbol);
            }

            Map<String, Object> bar = results.get(0);
            return mapBarToPriceResponse(symbol, bar);

        } catch (WebClientResponseException e) {
            // Handle rate limiting (429) gracefully
            if (e.getStatusCode().value() == 429) {
                log.warn("Polygon API rate limit hit for {}. Try again later.", symbol);
                throw new RuntimeException("Rate limit exceeded. Price data is cached for 5 minutes to avoid this. Please wait.", e);
            }
            log.error("Polygon API error for {}: {} - {}", symbol, e.getStatusCode(), e.getMessage());
            throw new RuntimeException("Failed to fetch stock quote from Polygon: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Error fetching stock quote from Polygon for {}: {}", symbol, e.getMessage());
            throw new RuntimeException("Failed to fetch stock quote: " + e.getMessage(), e);
        }
    }

    /**
     * Fallback to snapshot endpoint for real-time-ish data
     */
    private PriceResponse getSnapshotQuote(String symbol) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = polygonWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v2/snapshot/locale/us/markets/stocks/tickers/{ticker}")
                            .queryParam("apiKey", apiKey)
                            .build(symbol.toUpperCase()))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) {
                throw new RuntimeException("No response from Polygon snapshot API");
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> ticker = (Map<String, Object>) response.get("ticker");
            if (ticker == null) {
                throw new RuntimeException("No ticker data in Polygon snapshot response");
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> day = (Map<String, Object>) ticker.get("day");
            @SuppressWarnings("unchecked")
            Map<String, Object> prevDay = (Map<String, Object>) ticker.get("prevDay");

            BigDecimal currentPrice = getBigDecimal(day, "c", BigDecimal.ZERO);
            BigDecimal open = getBigDecimal(day, "o", currentPrice);
            BigDecimal high = getBigDecimal(day, "h", currentPrice);
            BigDecimal low = getBigDecimal(day, "l", currentPrice);
            BigDecimal prevClose = getBigDecimal(prevDay, "c", open);
            Long volume = getLong(day, "v", 0L);

            BigDecimal change = currentPrice.subtract(prevClose);
            BigDecimal changePercent = prevClose.compareTo(BigDecimal.ZERO) > 0
                    ? change.divide(prevClose, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"))
                    : BigDecimal.ZERO;

            return PriceResponse.builder()
                    .symbol(symbol.toUpperCase())
                    .price(currentPrice)
                    .open(open)
                    .high(high)
                    .low(low)
                    .previousClose(prevClose)
                    .change(change)
                    .changePercent(changePercent)
                    .volume(volume)
                    .timestamp(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("Snapshot fallback also failed for {}: {}", symbol, e.getMessage());
            throw new RuntimeException("Failed to fetch stock quote: " + e.getMessage(), e);
        }
    }

    @Override
    public PriceResponse getPreviousDayData(String symbol) {
        return getStockQuote(symbol); // Same endpoint
    }

    @Override
    public List<PriceResponse> getHistoricalData(String symbol, int multiplier, String timespan, String from, String to) {
        try {
            // Polygon aggregates endpoint: /v2/aggs/ticker/{ticker}/range/{multiplier}/{timespan}/{from}/{to}
            @SuppressWarnings("unchecked")
            Map<String, Object> response = polygonWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v2/aggs/ticker/{ticker}/range/{multiplier}/{timespan}/{from}/{to}")
                            .queryParam("adjusted", true)
                            .queryParam("sort", "asc")
                            .queryParam("limit", 120) // Max results
                            .queryParam("apiKey", apiKey)
                            .build(symbol.toUpperCase(), multiplier, timespan, from, to))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) {
                log.warn("No response from Polygon historical API for {}", symbol);
                return new ArrayList<>();
            }

            String status = (String) response.get("status");
            // Accept both "OK" and "DELAYED" (free tier returns DELAYED for 15-min delayed data)
            if (!"OK".equals(status) && !"DELAYED".equals(status)) {
                log.warn("Polygon historical API returned unexpected status '{}' for {}", status, symbol);
                return new ArrayList<>();
            }
            log.debug("Polygon historical API returned status '{}' for {}", status, symbol);

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
            if (results == null || results.isEmpty()) {
                log.info("No historical data from Polygon for {} ({} to {})", symbol, from, to);
                return new ArrayList<>();
            }

            List<PriceResponse> historicalData = new ArrayList<>();
            for (Map<String, Object> bar : results) {
                historicalData.add(mapBarToPriceResponse(symbol, bar));
            }

            log.info("Fetched {} historical bars from Polygon for {}", historicalData.size(), symbol);
            return historicalData;

        } catch (WebClientResponseException e) {
            if (e.getStatusCode().value() == 403) {
                log.warn("Polygon historical data requires subscription for {}", symbol);
                return new ArrayList<>();
            }
            log.error("Polygon historical API error for {}: {}", symbol, e.getMessage());
            return new ArrayList<>();
        } catch (Exception e) {
            log.error("Error fetching historical data from Polygon for {}: {}", symbol, e.getMessage());
            return new ArrayList<>();
        }
    }

    private PriceResponse mapBarToPriceResponse(String symbol, Map<String, Object> bar) {
        BigDecimal open = getBigDecimal(bar, "o", BigDecimal.ZERO);
        BigDecimal high = getBigDecimal(bar, "h", BigDecimal.ZERO);
        BigDecimal low = getBigDecimal(bar, "l", BigDecimal.ZERO);
        BigDecimal close = getBigDecimal(bar, "c", BigDecimal.ZERO);
        Long volume = getLong(bar, "v", 0L);
        Long timestampMs = getLong(bar, "t", System.currentTimeMillis());

        BigDecimal change = close.subtract(open);
        BigDecimal changePercent = open.compareTo(BigDecimal.ZERO) > 0
                ? change.divide(open, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"))
                : BigDecimal.ZERO;

        LocalDateTime timestamp = LocalDateTime.ofInstant(
                Instant.ofEpochMilli(timestampMs), ZoneOffset.UTC);

        return PriceResponse.builder()
                .symbol(symbol.toUpperCase())
                .price(close)
                .open(open)
                .high(high)
                .low(low)
                .previousClose(open) // Using open as previous close for bars
                .change(change)
                .changePercent(changePercent)
                .volume(volume)
                .timestamp(timestamp)
                .build();
    }

    private BigDecimal getBigDecimal(Map<String, Object> map, String key, BigDecimal defaultValue) {
        if (map != null && map.containsKey(key) && map.get(key) != null) {
            try {
                return new BigDecimal(map.get(key).toString());
            } catch (Exception e) {
                log.warn("Failed to parse BigDecimal for key {}: {}", key, e.getMessage());
            }
        }
        return defaultValue;
    }

    private Long getLong(Map<String, Object> map, String key, Long defaultValue) {
        if (map != null && map.containsKey(key) && map.get(key) != null) {
            try {
                return Long.parseLong(map.get(key).toString().split("\\.")[0]); // Handle decimals
            } catch (Exception e) {
                log.warn("Failed to parse Long for key {}: {}", key, e.getMessage());
            }
        }
        return defaultValue;
    }
}

