package com.exchange.service;

import com.exchange.dto.response.AssetResponse;
import com.exchange.entity.Asset;
import com.exchange.enums.AssetType;

import java.util.List;

public interface AssetService {

    List<AssetResponse> getAllAssets();

    List<AssetResponse> getAssetsByType(AssetType type);

    AssetResponse getAssetBySymbol(String symbol);

    Asset findBySymbol(String symbol);

    Asset findOrCreateAsset(String symbol, String name, AssetType type);
}

