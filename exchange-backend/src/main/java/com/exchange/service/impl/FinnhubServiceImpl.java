package com.exchange.service.impl;

import com.exchange.dto.response.PriceResponse;
import com.exchange.service.FinnhubService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FinnhubServiceImpl implements FinnhubService {

    private final WebClient finnhubWebClient;

    @Value("${app.finnhub.api-key}")
    private String apiKey;

    @Override
    public PriceResponse getStockQuote(String symbol) {
        // TODO: Implement Finnhub stock quote API call
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public List<PriceResponse> getHistoricalData(String symbol, String resolution, long from, long to) {
        // TODO: Implement Finnhub historical data API call
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public List<String> searchSymbols(String query) {
        // TODO: Implement Finnhub symbol search API call
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

