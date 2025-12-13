package com.exchange.service.impl;

import com.exchange.dto.response.PriceResponse;
import com.exchange.enums.AssetType;
import com.exchange.service.CoinbaseService;
import com.exchange.service.PolygonService;
import com.exchange.service.PriceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PriceServiceImpl implements PriceService {

    private final PolygonService polygonService;
    private final CoinbaseService coinbaseService;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    @Cacheable(value = "prices", key = "T(String).format('%s:%s', #type, #symbol?.toUpperCase())")
    public PriceResponse getPrice(String symbol, AssetType type) {
        return switch (type) {
            case STOCK -> polygonService.getStockQuote(symbol);
            case CRYPTO -> coinbaseService.getCryptoPrice(symbol);
        };
    }

    @Override
    public Map<String, PriceResponse> getPrices(List<String> symbols, AssetType type) {
        Map<String, PriceResponse> prices = new HashMap<>();
        for (String symbol : symbols) {
            try {
                PriceResponse price = getPrice(symbol, type);
                prices.put(symbol, price);
            } catch (Exception e) {
                log.warn("Failed to fetch price for {}: {}", symbol, e.getMessage());
            }
        }
        return prices;
    }

    @Override
    public BigDecimal getCurrentPrice(String symbol, AssetType type) {
        return getPrice(symbol, type).getPrice();
    }

    @Override
    public List<PriceResponse> getHistoricalPrices(String symbol, AssetType type, String resolution, long from, long to) {
        return switch (type) {
            case STOCK -> getPolygonHistoricalData(symbol, resolution, from, to);
            case CRYPTO -> coinbaseService.getHistoricalData(symbol, resolution, from, to);
        };
    }

    /**
     * Convert Unix timestamps to dates and fetch from Polygon
     */
    private List<PriceResponse> getPolygonHistoricalData(String symbol, String resolution, long from, long to) {
        // Convert Unix timestamps (seconds) to LocalDate for Polygon API
        LocalDate fromDate = Instant.ofEpochSecond(from).atZone(ZoneId.of("America/New_York")).toLocalDate();
        LocalDate toDate = Instant.ofEpochSecond(to).atZone(ZoneId.of("America/New_York")).toLocalDate();

        // Map resolution to Polygon timespan
        int multiplier = 1;
        String timespan = mapResolutionToTimespan(resolution);

        // Polygon uses specific multipliers for different resolutions
        if (resolution.equalsIgnoreCase("5") || resolution.equalsIgnoreCase("5M")) {
            multiplier = 5;
            timespan = "minute";
        } else if (resolution.equalsIgnoreCase("15") || resolution.equalsIgnoreCase("15M")) {
            multiplier = 15;
            timespan = "minute";
        } else if (resolution.equalsIgnoreCase("60") || resolution.equalsIgnoreCase("1H")) {
            multiplier = 1;
            timespan = "hour";
        }

        String fromStr = fromDate.format(DATE_FORMAT);
        String toStr = toDate.format(DATE_FORMAT);

        log.debug("Fetching Polygon historical data for {} from {} to {} ({} {})", 
                symbol, fromStr, toStr, multiplier, timespan);

        return polygonService.getHistoricalData(symbol, multiplier, timespan, fromStr, toStr);
    }

    private String mapResolutionToTimespan(String resolution) {
        return switch (resolution.toUpperCase()) {
            case "1", "1MIN", "1M" -> "minute";
            case "5", "5MIN", "5M" -> "minute";
            case "15", "15MIN", "15M" -> "minute";
            case "30", "30MIN", "30M" -> "minute";
            case "60", "1H", "1HOUR" -> "hour";
            case "D", "1D", "DAY", "DAILY" -> "day";
            case "W", "1W", "WEEK", "WEEKLY" -> "week";
            case "MO", "1MO", "MONTH", "MONTHLY" -> "month";
            default -> "day";
        };
    }
}