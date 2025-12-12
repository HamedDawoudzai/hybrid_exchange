package com.exchange.service.impl;

import com.exchange.dto.response.PriceResponse;
import com.exchange.enums.AssetType;
import com.exchange.service.CoinbaseService;
import com.exchange.service.FinnhubService;
import com.exchange.service.PriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PriceServiceImpl implements PriceService {

    private final FinnhubService finnhubService;
    private final CoinbaseService coinbaseService;

    @Override
    public PriceResponse getPrice(String symbol, AssetType type) {
        // TODO: Implement get price
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public Map<String, PriceResponse> getPrices(List<String> symbols, AssetType type) {
        // TODO: Implement get prices
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public BigDecimal getCurrentPrice(String symbol, AssetType type) {
        // TODO: Implement get current price
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public List<PriceResponse> getHistoricalPrices(String symbol, AssetType type, String resolution, long from, long to) {
        // TODO: Implement get historical prices
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

