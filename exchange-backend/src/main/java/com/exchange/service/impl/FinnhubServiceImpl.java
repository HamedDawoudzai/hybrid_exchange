package com.exchange.service.impl;

import com.exchange.dto.response.PriceResponse;
import com.exchange.service.FinnhubService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class FinnhubServiceImpl implements FinnhubService {

    private final WebClient finnhubWebClient;

    @Value("${app.finnhub.api-key}")
    private String apiKey;

    @Override
    public PriceResponse getStockQuote(String symbol) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> quote = (Map<String, Object>) finnhubWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/quote")
                            .queryParam("symbol", symbol.toUpperCase())
                            .queryParam("token", Objects.requireNonNull(apiKey, "apiKey must not be null"))
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (quote == null || quote.isEmpty()) {
                throw new RuntimeException("Failed to fetch quote for " + symbol);
            }

            BigDecimal currentPrice = getBigDecimalValue(quote, "c", BigDecimal.ZERO);
            BigDecimal open = getBigDecimalValue(quote, "o", currentPrice);
            BigDecimal high = getBigDecimalValue(quote, "h", currentPrice);
            BigDecimal low = getBigDecimalValue(quote, "l", currentPrice);
            BigDecimal previousClose = getBigDecimalValue(quote, "pc", open);
            Long volume = quote.containsKey("v") ? Long.parseLong(quote.get("v").toString()) : 0L;

            BigDecimal change = currentPrice.subtract(previousClose);
            BigDecimal changePercent = previousClose.compareTo(BigDecimal.ZERO) > 0
                    ? change.divide(previousClose, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"))
                    : BigDecimal.ZERO;

            return PriceResponse.builder()
                    .symbol(symbol.toUpperCase())
                    .price(currentPrice)
                    .open(open)
                    .high(high)
                    .low(low)
                    .previousClose(previousClose)
                    .change(change)
                    .changePercent(changePercent)
                    .volume(volume)
                    .timestamp(LocalDateTime.now())
                    .build();
        } catch (Exception e) {
            log.error("Error fetching stock quote for {}: {}", symbol, e.getMessage());
            throw new RuntimeException("Failed to fetch stock quote: " + e.getMessage(), e);
        }
    }

    @Override
    public List<PriceResponse> getHistoricalData(String symbol, String resolution, long from, long to) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = (Map<String, Object>) finnhubWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/stock/candle")
                            .queryParam("symbol", symbol.toUpperCase())
                            .queryParam("resolution", mapResolution(resolution))
                            .queryParam("from", from)
                            .queryParam("to", to)
                            .queryParam("token", Objects.requireNonNull(apiKey, "apiKey must not be null"))
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null || response.isEmpty() || !response.containsKey("s")) {
                String status = response != null && response.containsKey("s") ? response.get("s").toString() : "unknown";
                if ("no_data".equals(status)) {
                    return new ArrayList<>();
                }
                throw new RuntimeException("Failed to fetch historical data for " + symbol);
            }

            List<?> timestamps = (List<?>) response.get("t");
            List<?> opens = (List<?>) response.get("o");
            List<?> highs = (List<?>) response.get("h");
            List<?> lows = (List<?>) response.get("l");
            List<?> closes = (List<?>) response.get("c");
            List<?> volumes = response.containsKey("v") ? (List<?>) response.get("v") : new ArrayList<>();

            if (timestamps == null || timestamps.isEmpty()) {
                return new ArrayList<>();
            }

            List<PriceResponse> historicalData = new ArrayList<>();
            for (int i = 0; i < timestamps.size(); i++) {
                long timestamp = Long.parseLong(timestamps.get(i).toString());
                BigDecimal open = new BigDecimal(opens.get(i).toString());
                BigDecimal high = new BigDecimal(highs.get(i).toString());
                BigDecimal low = new BigDecimal(lows.get(i).toString());
                BigDecimal close = new BigDecimal(closes.get(i).toString());
                Long volume = volumes.size() > i ? Long.parseLong(volumes.get(i).toString()) : 0L;

                BigDecimal change = close.subtract(open);
                BigDecimal changePercent = open.compareTo(BigDecimal.ZERO) > 0
                        ? change.divide(open, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"))
                        : BigDecimal.ZERO;

                historicalData.add(PriceResponse.builder()
                        .symbol(symbol.toUpperCase())
                        .price(close)
                        .open(open)
                        .high(high)
                        .low(low)
                        .previousClose(open)
                        .change(change)
                        .changePercent(changePercent)
                        .volume(volume)
                        .timestamp(LocalDateTime.ofEpochSecond(timestamp, 0, ZoneOffset.UTC))
                        .build());
            }

            return historicalData;
        } catch (Exception e) {
            log.error("Error fetching historical data for {}: {}", symbol, e.getMessage());
            throw new RuntimeException("Failed to fetch historical data: " + e.getMessage(), e);
        }
    }

    @Override
    public List<String> searchSymbols(String query) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = (Map<String, Object>) finnhubWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search")
                            .queryParam("q", query)
                            .queryParam("token", Objects.requireNonNull(apiKey, "apiKey must not be null"))
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null || !response.containsKey("result")) {
                return new ArrayList<>();
            }

            List<?> results = (List<?>) response.get("result");
            List<String> symbols = new ArrayList<>();

            if (results != null) {
                for (Object resultObj : results) {
                    if (resultObj instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> result = (Map<String, Object>) resultObj;
                        if (result.containsKey("symbol")) {
                            String sym = result.get("symbol").toString();
                            if (!symbols.contains(sym)) {
                                symbols.add(sym);
                            }
                        }
                    }
                }
            }

            return symbols;
        } catch (Exception e) {
            log.error("Error searching symbols for {}: {}", query, e.getMessage());
            throw new RuntimeException("Failed to search symbols: " + e.getMessage(), e);
        }
    }

    private BigDecimal getBigDecimalValue(Map<String, Object> map, String key, BigDecimal defaultValue) {
        if (map.containsKey(key) && map.get(key) != null) {
            try {
                return new BigDecimal(map.get(key).toString());
            } catch (Exception e) {
                log.warn("Failed to parse BigDecimal for key {}: {}", key, e.getMessage());
            }
        }
        return defaultValue;
    }

    private String mapResolution(String resolution) {
        return switch (resolution.toUpperCase()) {
            case "1", "1MIN", "1M" -> "1";
            case "5", "5MIN", "5M" -> "5";
            case "15", "15MIN", "15M" -> "15";
            case "30", "30MIN", "30M" -> "30";
            case "60", "1H", "1HOUR", "1HR" -> "60";
            case "D", "1D", "DAY", "DAILY" -> "D";
            case "W", "1W", "WEEK", "WEEKLY" -> "W";
            case "MO", "1MO", "MONTH", "MONTHLY" -> "M"; // month mapping (no 1M here)
            default -> "D";
        };
    }
}