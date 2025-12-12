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
        List<AssetResponse> assets = assetService.getAllAssets();
        return ResponseEntity.ok(ApiResponse.success(assets));
    }

    @GetMapping("/stocks")
    public ResponseEntity<ApiResponse<List<AssetResponse>>> getStocks() {
        List<AssetResponse> stocks = assetService.getAssetsByType(AssetType.STOCK);
        return ResponseEntity.ok(ApiResponse.success(stocks));
    }

    @GetMapping("/crypto")
    public ResponseEntity<ApiResponse<List<AssetResponse>>> getCrypto() {
        List<AssetResponse> crypto = assetService.getAssetsByType(AssetType.CRYPTO);
        return ResponseEntity.ok(ApiResponse.success(crypto));
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<ApiResponse<AssetResponse>> getAsset(@PathVariable String symbol) {
        AssetResponse asset = assetService.getAssetBySymbol(symbol);
        return ResponseEntity.ok(ApiResponse.success(asset));
    }
}