package com.exchange.dto.response;

import com.exchange.entity.WatchlistItem;
import com.exchange.enums.AssetType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WatchlistItemResponse {
    private Long id;
    private Long assetId;
    private String symbol;
    private String name;
    private AssetType assetType;
    private BigDecimal currentPrice;
    private BigDecimal priceChange24h;
    private BigDecimal priceChangePercent24h;
    private LocalDateTime addedAt;

    public static WatchlistItemResponse fromEntity(WatchlistItem item) {
        return WatchlistItemResponse.builder()
                .id(item.getId())
                .assetId(item.getAsset().getId())
                .symbol(item.getAsset().getSymbol())
                .name(item.getAsset().getName())
                .assetType(item.getAsset().getType())
                .addedAt(item.getCreatedAt())
                .build();
    }

    public static WatchlistItemResponse fromEntityWithPrice(
            WatchlistItem item,
            BigDecimal currentPrice,
            BigDecimal priceChange24h,
            BigDecimal priceChangePercent24h
    ) {
        return WatchlistItemResponse.builder()
                .id(item.getId())
                .assetId(item.getAsset().getId())
                .symbol(item.getAsset().getSymbol())
                .name(item.getAsset().getName())
                .assetType(item.getAsset().getType())
                .currentPrice(currentPrice)
                .priceChange24h(priceChange24h)
                .priceChangePercent24h(priceChangePercent24h)
                .addedAt(item.getCreatedAt())
                .build();
    }
}

