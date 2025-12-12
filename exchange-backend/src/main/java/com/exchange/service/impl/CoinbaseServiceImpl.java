package com.exchange.service.impl;

import com.exchange.dto.response.PriceResponse;
import com.exchange.service.CoinbaseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

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
@RequiredArgsConstructor
public class CoinbaseServiceImpl implements CoinbaseService {

    private final WebClient coinbaseWebClient;

    @Override
    public PriceResponse getCryptoPrice(String symbol) {
        try {
            String productId = symbol.toUpperCase().contains("-") ? symbol.toUpperCase() : symbol.toUpperCase() + "-USD";

            @SuppressWarnings("unchecked")
            Map<String, Object> stats = (Map<String, Object>) coinbaseWebClient.get()
                    .uri("/products/{productId}/stats", productId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (stats == null) {
                throw new RuntimeException("Failed to fetch price for " + symbol);
            }

            BigDecimal open = toBigDecimal(stats.get("open"), BigDecimal.ZERO);
            BigDecimal high = toBigDecimal(stats.get("high"), open);
            BigDecimal low = toBigDecimal(stats.get("low"), open);
            BigDecimal last = toBigDecimal(stats.get("last"), open);
            BigDecimal volume = toBigDecimal(stats.get("volume"), BigDecimal.ZERO);

            BigDecimal price = last;

            BigDecimal change = price.subtract(open);
            BigDecimal changePercent = open.compareTo(BigDecimal.ZERO) > 0
                    ? change.divide(open, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"))
                    : BigDecimal.ZERO;

            return PriceResponse.builder()
                    .symbol(symbol.toUpperCase())
                    .price(price)
                    .open(open)
                    .high(high)
                    .low(low)
                    .previousClose(open)
                    .change(change)
                    .changePercent(changePercent)
                    .volume(volume.longValue())
                    .timestamp(LocalDateTime.now())
                    .build();
        } catch (Exception e) {
            log.error("Error fetching crypto price for {}: {}", symbol, e.getMessage());
            throw new RuntimeException("Failed to fetch crypto price: " + e.getMessage(), e);
        }
    }

    @Override
    public List<PriceResponse> getHistoricalData(String symbol, String granularity, long start, long end) {
        try {
            String productId = symbol.toUpperCase().contains("-") ? symbol.toUpperCase() : symbol.toUpperCase() + "-USD";
            String granularityParam = mapGranularity(granularity);

            @SuppressWarnings("unchecked")
            List<List<Object>> candles = (List<List<Object>>) (List<?>) coinbaseWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/products/{productId}/candles")
                            .queryParam("granularity", granularityParam)
                            .queryParam("start", Instant.ofEpochSecond(start).toString())
                            .queryParam("end", Instant.ofEpochSecond(end).toString())
                            .build(productId))
                    .retrieve()
                    .bodyToMono(List.class)
                    .block();

            if (candles == null) {
                return new ArrayList<>();
            }

            List<PriceResponse> historicalData = new ArrayList<>();
            for (Object candleObj : candles) {
                if (candleObj instanceof List) {
                    List<?> candle = (List<?>) candleObj;
                    if (candle.size() >= 6) {
                        long ts = Long.parseLong(candle.get(0).toString());
                        BigDecimal low = new BigDecimal(candle.get(1).toString());
                        BigDecimal high = new BigDecimal(candle.get(2).toString());
                        BigDecimal open = new BigDecimal(candle.get(3).toString());
                        BigDecimal close = new BigDecimal(candle.get(4).toString());
                        BigDecimal volume = new BigDecimal(candle.get(5).toString());

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
                                .volume(volume.longValue())
                                .timestamp(LocalDateTime.ofEpochSecond(ts, 0, ZoneOffset.UTC))
                                .build());
                    }
                }
            }

            return historicalData;
        } catch (Exception e) {
            log.error("Error fetching historical data for {}: {}", symbol, e.getMessage());
            throw new RuntimeException("Failed to fetch historical data: " + e.getMessage(), e);
        }
    }

    @Override
    public List<String> getAvailableProducts() {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> products = (List<Map<String, Object>>) (List<?>) coinbaseWebClient.get()
                    .uri("/products")
                    .retrieve()
                    .bodyToMono(List.class)
                    .block();

            if (products == null) {
                return new ArrayList<>();
            }

            List<String> symbols = new ArrayList<>();
            for (Map<String, Object> product : products) {
                String productId = product.get("id").toString();
                if (productId.contains("-")) {
                    String base = productId.split("-")[0];
                    if (!symbols.contains(base)) {
                        symbols.add(base);
                    }
                }
            }

            return symbols;
        } catch (Exception e) {
            log.error("Error fetching available products: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch available products: " + e.getMessage(), e);
        }
    }

    private String mapGranularity(String resolution) {
        // Map common resolutions to Coinbase granularity (seconds)
        return switch (resolution.toUpperCase()) {
            case "1", "1MIN", "1M" -> "60";
            case "5", "5MIN", "5M" -> "300";
            case "15", "15MIN", "15M" -> "900";
            case "60", "1H", "1HOUR", "1HR" -> "3600";
            case "240", "4H", "4HOUR", "4HR" -> "14400";
            case "D", "1D", "DAY", "DAILY" -> "86400";
            default -> "3600"; // default 1h
        };
    }

    private BigDecimal toBigDecimal(Object value, BigDecimal defaultValue) {
        try {
            if (value == null) {
                return defaultValue;
            }
            return new BigDecimal(value.toString());
        } catch (Exception e) {
            log.warn("Failed to parse numeric value {}: {}", value, e.getMessage());
            return defaultValue;
        }
    }
}