package com.exchange.service;

import com.exchange.dto.response.PriceResponse;

import java.util.List;

/**
 * Service for fetching stock data from Polygon.io API
 */
public interface PolygonService {

    /**
     * Get current/latest stock quote (15-min delayed on free tier)
     */
    PriceResponse getStockQuote(String symbol);

    /**
     * Get previous day's OHLC data
     */
    PriceResponse getPreviousDayData(String symbol);

    /**
     * Get historical aggregated bars (OHLC data)
     * @param symbol Stock symbol
     * @param multiplier Size of the timespan multiplier (e.g., 1 for 1 day)
     * @param timespan Timespan: minute, hour, day, week, month, quarter, year
     * @param from Start date (YYYY-MM-DD)
     * @param to End date (YYYY-MM-DD)
     */
    List<PriceResponse> getHistoricalData(String symbol, int multiplier, String timespan, String from, String to);
}

