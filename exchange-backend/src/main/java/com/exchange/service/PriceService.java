package com.exchange.service;

import com.exchange.dto.response.PriceResponse;
import com.exchange.enums.AssetType;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface PriceService {

    PriceResponse getPrice(String symbol, AssetType type);

    Map<String, PriceResponse> getPrices(List<String> symbols, AssetType type);

    BigDecimal getCurrentPrice(String symbol, AssetType type);

    List<PriceResponse> getHistoricalPrices(String symbol, AssetType type, String resolution, long from, long to);
}

