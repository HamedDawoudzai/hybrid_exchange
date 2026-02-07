package com.exchange.service.impl;

import com.exchange.dto.response.AssetResponse;
import com.exchange.dto.response.PriceResponse;
import com.exchange.entity.Asset;
import com.exchange.enums.AssetType;
import com.exchange.exception.ResourceNotFoundException;
import com.exchange.repository.AssetRepository;
import com.exchange.service.AssetService;
import com.exchange.service.PriceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;
    private final PriceService priceService;

    /**
     * List endpoints return asset metadata WITHOUT live prices.
     * Prices are fetched individually via /api/prices/stock/{symbol}
     * and /api/prices/crypto/{symbol} to respect Polygon rate limits (5/min).
     */

    @Override
    public List<AssetResponse> getAllAssets() {
        List<Asset> assets = assetRepository.findByActiveTrue();
        return assets.stream().map(this::toAssetResponse).collect(Collectors.toList());
    }

    @Override
    public List<AssetResponse> getAssetsByType(AssetType type) {
        List<Asset> assets = assetRepository.findByTypeAndActiveTrue(type);
        return assets.stream().map(this::toAssetResponse).collect(Collectors.toList());
    }

    @Override
    public AssetResponse getAssetBySymbol(String symbol) {
        Asset asset = findBySymbol(symbol);
        return toAssetResponseWithPrice(asset);
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

    /**
     * Build response WITHOUT price (used for list endpoints).
     */
    private AssetResponse toAssetResponse(Asset asset) {
        return AssetResponse.builder()
                .id(asset.getId())
                .symbol(asset.getSymbol())
                .name(asset.getName())
                .type(asset.getType())
                .description(asset.getDescription())
                .logoUrl(asset.getLogoUrl())
                .currentPrice(null)
                .priceChange24h(null)
                .priceChangePercent24h(null)
                .build();
    }

    /**
     * Build response WITH live price (used for single-asset detail endpoint).
     */
    private AssetResponse toAssetResponseWithPrice(Asset asset) {
        BigDecimal currentPrice = null;
        BigDecimal priceChange = null;
        BigDecimal priceChangePercent = null;

        try {
            PriceResponse price = priceService.getPrice(asset.getSymbol(), asset.getType());
            if (price != null) {
                currentPrice = price.getPrice();
                priceChange = price.getChange();
                priceChangePercent = price.getChangePercent();
            }
        } catch (Exception e) {
            log.debug("Could not fetch price for {}: {}", asset.getSymbol(), e.getMessage());
        }

        return AssetResponse.builder()
                .id(asset.getId())
                .symbol(asset.getSymbol())
                .name(asset.getName())
                .type(asset.getType())
                .description(asset.getDescription())
                .logoUrl(asset.getLogoUrl())
                .currentPrice(currentPrice)
                .priceChange24h(priceChange)
                .priceChangePercent24h(priceChangePercent)
                .build();
    }
}
