package com.exchange.dto.response;

import com.exchange.entity.Asset;
import com.exchange.enums.AssetType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetResponse {

    private Long id;
    private String symbol;
    private String name;
    private AssetType type;
    private String description;
    private String logoUrl;
    private BigDecimal currentPrice;
    private BigDecimal priceChange24h;
    private BigDecimal priceChangePercent24h;

    public static AssetResponse fromEntity(Asset asset) {
        return AssetResponse.builder()
                .id(asset.getId())
                .symbol(asset.getSymbol())
                .name(asset.getName())
                .type(asset.getType())
                .description(asset.getDescription())
                .logoUrl(asset.getLogoUrl())
                .build();
    }

    public static AssetResponse fromEntityWithPrice(Asset asset, BigDecimal currentPrice, 
                                                     BigDecimal priceChange24h, BigDecimal priceChangePercent24h) {
        return AssetResponse.builder()
                .id(asset.getId())
                .symbol(asset.getSymbol())
                .name(asset.getName())
                .type(asset.getType())
                .description(asset.getDescription())
                .logoUrl(asset.getLogoUrl())
                .currentPrice(currentPrice)
                .priceChange24h(priceChange24h)
                .priceChangePercent24h(priceChangePercent24h)
                .build();
    }
}

