package com.exchange.service;

import com.exchange.dto.response.PriceResponse;

import java.util.List;

public interface CoinbaseService {

    PriceResponse getCryptoPrice(String symbol);

    List<PriceResponse> getHistoricalData(String symbol, String granularity, long start, long end);

    List<String> getAvailableProducts();
}

