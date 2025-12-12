package com.exchange.service.impl;

import com.exchange.dto.response.AssetResponse;
import com.exchange.entity.Asset;
import com.exchange.enums.AssetType;
import com.exchange.repository.AssetRepository;
import com.exchange.service.AssetService;
import com.exchange.service.PriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;
    private final PriceService priceService;

    @Override
    public List<AssetResponse> getAllAssets() {
        // TODO: Implement get all assets
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public List<AssetResponse> getAssetsByType(AssetType type) {
        // TODO: Implement get assets by type
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public AssetResponse getAssetBySymbol(String symbol) {
        // TODO: Implement get asset by symbol
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public Asset findBySymbol(String symbol) {
        // TODO: Implement find by symbol
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public Asset findOrCreateAsset(String symbol, String name, AssetType type) {
        // TODO: Implement find or create asset
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

