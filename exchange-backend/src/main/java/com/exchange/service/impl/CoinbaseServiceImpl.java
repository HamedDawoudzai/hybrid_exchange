package com.exchange.service.impl;

import com.exchange.dto.response.PriceResponse;
import com.exchange.service.CoinbaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CoinbaseServiceImpl implements CoinbaseService {

    private final WebClient coinbaseWebClient;

    @Override
    public PriceResponse getCryptoPrice(String symbol) {
        // TODO: Implement Coinbase price API call
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public List<PriceResponse> getHistoricalData(String symbol, String granularity, long start, long end) {
        // TODO: Implement Coinbase historical data API call
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public List<String> getAvailableProducts() {
        // TODO: Implement Coinbase products API call
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

