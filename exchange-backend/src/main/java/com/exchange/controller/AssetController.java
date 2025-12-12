package com.exchange.controller;

import com.exchange.dto.response.ApiResponse;
import com.exchange.dto.response.AssetResponse;
import com.exchange.enums.AssetType;
import com.exchange.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssetResponse>>> getAllAssets() {
        // TODO: Implement get all assets endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/stocks")
    public ResponseEntity<ApiResponse<List<AssetResponse>>> getStocks() {
        // TODO: Implement get stocks endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/crypto")
    public ResponseEntity<ApiResponse<List<AssetResponse>>> getCrypto() {
        // TODO: Implement get crypto endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<ApiResponse<AssetResponse>> getAsset(@PathVariable String symbol) {
        // TODO: Implement get asset endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

