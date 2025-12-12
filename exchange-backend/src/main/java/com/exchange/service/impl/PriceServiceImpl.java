package com.exchange.service.impl;

import com.exchange.dto.response.PriceResponse;
import com.exchange.enums.AssetType;
import com.exchange.service.CoinbaseService;
import com.exchange.service.FinnhubService;
import com.exchange.service.PriceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PriceServiceImpl implements PriceService {

    private final FinnhubService finnhubService;
    private final CoinbaseService coinbaseService;

    @Override
    @Cacheable(value = "prices", key = "T(String).format('%s:%s', #type, #symbol?.toUpperCase())")
    public PriceResponse getPrice(String symbol, AssetType type) {
        return switch (type) {
            case STOCK -> finnhubService.getStockQuote(symbol);
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
            case STOCK -> finnhubService.getHistoricalData(symbol, resolution, from, to);
            case CRYPTO -> coinbaseService.getHistoricalData(symbol, resolution, from, to);
        };
    }
}