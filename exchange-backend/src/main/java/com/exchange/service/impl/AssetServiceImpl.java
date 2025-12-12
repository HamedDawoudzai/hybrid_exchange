package com.exchange.service.impl;

import com.exchange.dto.response.AssetResponse;
import com.exchange.entity.Asset;
import com.exchange.enums.AssetType;
import com.exchange.exception.ResourceNotFoundException;
import com.exchange.repository.AssetRepository;
import com.exchange.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Objects;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;

    @Override
    public List<AssetResponse> getAllAssets() {
        return assetRepository.findByActiveTrue().stream()
                .map(this::toAssetResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AssetResponse> getAssetsByType(AssetType type) {
        return assetRepository.findByTypeAndActiveTrue(type).stream()
                .map(this::toAssetResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AssetResponse getAssetBySymbol(String symbol) {
        Asset asset = findBySymbol(symbol);
        return toAssetResponse(asset);
    }

    @Override
    public Asset findBySymbol(String symbol) {
        return assetRepository.findBySymbol(symbol.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Asset", "symbol", symbol));
    }

    @Override
    @Transactional
    public Asset findOrCreateAsset(String symbol, String name, AssetType type) {
        return assetRepository.findBySymbol(symbol.toUpperCase())
                .orElseGet(() -> {
                    Asset newAsset = Asset.builder()
                            .symbol(symbol.toUpperCase())
                            .name(name != null ? name : symbol.toUpperCase())
                            .type(type)
                            .active(true)
                            .build();
                    return assetRepository.save(Objects.requireNonNull(newAsset, "newAsset must not be null"));
                });
    }

    private AssetResponse toAssetResponse(Asset asset) {
        return AssetResponse.builder()
                .id(asset.getId())
                .symbol(asset.getSymbol())
                .name(asset.getName())
                .type(asset.getType())
                .description(asset.getDescription())
                .logoUrl(asset.getLogoUrl())
                .build();
    }
}