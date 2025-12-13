package com.exchange.service;

import com.exchange.dto.response.PriceResponse;

import java.util.List;

public interface PolygonService {
    
    /**
     * Get current stock quote from Polygon.io
     */
    PriceResponse getStockQuote(String symbol);
    
    /**
     * Get historical stock data from Polygon.io
     */
    List<PriceResponse> getHistoricalData(String symbol, int multiplier, String timespan, String from, String to);
}

