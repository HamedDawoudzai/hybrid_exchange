package com.exchange.service;

import com.exchange.dto.response.PriceResponse;

import java.util.List;

public interface FinnhubService {

    PriceResponse getStockQuote(String symbol);

    List<PriceResponse> getHistoricalData(String symbol, String resolution, long from, long to);

    List<String> searchSymbols(String query);
}

