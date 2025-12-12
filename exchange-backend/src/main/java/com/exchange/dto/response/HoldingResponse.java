package com.exchange.dto.response;

import com.exchange.entity.Holding;
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
public class HoldingResponse {

    private Long id;
    private String symbol;
    private String assetName;
    private AssetType assetType;
    private BigDecimal quantity;
    private BigDecimal averageBuyPrice;
    private BigDecimal currentPrice;
    private BigDecimal currentValue;
    private BigDecimal profitLoss;
    private BigDecimal profitLossPercent;

    public static HoldingResponse fromEntity(Holding holding) {
        return HoldingResponse.builder()
                .id(holding.getId())
                .symbol(holding.getAsset().getSymbol())
                .assetName(holding.getAsset().getName())
                .assetType(holding.getAsset().getType())
                .quantity(holding.getQuantity())
                .averageBuyPrice(holding.getAverageBuyPrice())
                .build();
    }

    public static HoldingResponse fromEntityWithPrice(Holding holding, BigDecimal currentPrice) {
        BigDecimal currentValue = holding.getQuantity().multiply(currentPrice);
        BigDecimal costBasis = holding.getQuantity().multiply(holding.getAverageBuyPrice());
        BigDecimal profitLoss = currentValue.subtract(costBasis);
        BigDecimal profitLossPercent = costBasis.compareTo(BigDecimal.ZERO) > 0
                ? profitLoss.divide(costBasis, 4, java.math.RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        return HoldingResponse.builder()
                .id(holding.getId())
                .symbol(holding.getAsset().getSymbol())
                .assetName(holding.getAsset().getName())
                .assetType(holding.getAsset().getType())
                .quantity(holding.getQuantity())
                .averageBuyPrice(holding.getAverageBuyPrice())
                .currentPrice(currentPrice)
                .currentValue(currentValue)
                .profitLoss(profitLoss)
                .profitLossPercent(profitLossPercent)
                .build();
    }
}

