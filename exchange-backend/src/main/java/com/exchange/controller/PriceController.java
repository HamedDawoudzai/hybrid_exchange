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
        // TODO: Implement get stock price endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/crypto/{symbol}")
    public ResponseEntity<ApiResponse<PriceResponse>> getCryptoPrice(@PathVariable String symbol) {
        // TODO: Implement get crypto price endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/stock/{symbol}/history")
    public ResponseEntity<ApiResponse<List<PriceResponse>>> getStockHistory(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "D") String resolution,
            @RequestParam long from,
            @RequestParam long to) {
        // TODO: Implement get stock history endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/crypto/{symbol}/history")
    public ResponseEntity<ApiResponse<List<PriceResponse>>> getCryptoHistory(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "3600") String granularity,
            @RequestParam long from,
            @RequestParam long to) {
        // TODO: Implement get crypto history endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Map<String, PriceResponse>>> getBatchPrices(
            @RequestBody List<String> symbols,
            @RequestParam AssetType type) {
        // TODO: Implement batch prices endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

