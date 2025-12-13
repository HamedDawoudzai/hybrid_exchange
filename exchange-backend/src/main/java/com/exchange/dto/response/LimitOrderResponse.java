package com.exchange.dto.response;

import com.exchange.entity.LimitOrder;
import com.exchange.enums.AssetType;
import com.exchange.enums.LimitOrderStatus;
import com.exchange.enums.OrderType;
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
public class LimitOrderResponse {
    private Long id;
    private Long portfolioId;
    private String portfolioName;
    private Long assetId;
    private String symbol;
    private String assetName;
    private AssetType assetType;
    private OrderType type;
    private BigDecimal targetPrice;
    private BigDecimal quantity;
    private BigDecimal reservedAmount;
    private LimitOrderStatus status;
    private BigDecimal filledPrice;
    private LocalDateTime filledAt;
    private LocalDateTime createdAt;
    private BigDecimal currentPrice; // For UI display

    public static LimitOrderResponse fromEntity(LimitOrder order) {
        return LimitOrderResponse.builder()
                .id(order.getId())
                .portfolioId(order.getPortfolio().getId())
                .portfolioName(order.getPortfolio().getName())
                .assetId(order.getAsset().getId())
                .symbol(order.getAsset().getSymbol())
                .assetName(order.getAsset().getName())
                .assetType(order.getAsset().getType())
                .type(order.getType())
                .targetPrice(order.getTargetPrice())
                .quantity(order.getQuantity())
                .reservedAmount(order.getReservedAmount())
                .status(order.getStatus())
                .filledPrice(order.getFilledPrice())
                .filledAt(order.getFilledAt())
                .createdAt(order.getCreatedAt())
                .build();
    }

    public static LimitOrderResponse fromEntityWithCurrentPrice(LimitOrder order, BigDecimal currentPrice) {
        LimitOrderResponse response = fromEntity(order);
        response.setCurrentPrice(currentPrice);
        return response;
    }
}

