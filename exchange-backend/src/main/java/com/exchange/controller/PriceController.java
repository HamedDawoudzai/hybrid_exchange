package com.exchange.controller;

import com.exchange.dto.response.ApiResponse;
import com.exchange.dto.response.PriceResponse;
import com.exchange.enums.AssetType;
import com.exchange.service.PriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prices")
@RequiredArgsConstructor
public class PriceController {

    private final PriceService priceService;

    @GetMapping("/stock/{symbol}")
    public ResponseEntity<ApiResponse<PriceResponse>> getStockPrice(@PathVariable String symbol) {
        PriceResponse price = priceService.getPrice(symbol, AssetType.STOCK);
        return ResponseEntity.ok(ApiResponse.success(price));
    }

    @GetMapping("/crypto/{symbol}")
    public ResponseEntity<ApiResponse<PriceResponse>> getCryptoPrice(@PathVariable String symbol) {
        PriceResponse price = priceService.getPrice(symbol, AssetType.CRYPTO);
        return ResponseEntity.ok(ApiResponse.success(price));
    }

    @GetMapping("/stock/{symbol}/history")
    public ResponseEntity<ApiResponse<List<PriceResponse>>> getStockHistory(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "D") String resolution,
            @RequestParam long from,
            @RequestParam long to) {
        List<PriceResponse> history = priceService.getHistoricalPrices(symbol, AssetType.STOCK, resolution, from, to);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/crypto/{symbol}/history")
    public ResponseEntity<ApiResponse<List<PriceResponse>>> getCryptoHistory(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "3600") String granularity,
            @RequestParam long from,
            @RequestParam long to) {
        List<PriceResponse> history = priceService.getHistoricalPrices(symbol, AssetType.CRYPTO, granularity, from, to);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Map<String, PriceResponse>>> getBatchPrices(
            @RequestBody List<String> symbols,
            @RequestParam AssetType type) {
        Map<String, PriceResponse> prices = priceService.getPrices(symbols, type);
        return ResponseEntity.ok(ApiResponse.success(prices));
    }
}