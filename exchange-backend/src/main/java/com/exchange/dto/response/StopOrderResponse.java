package com.exchange.dto.response;

import com.exchange.entity.StopOrder;
import com.exchange.enums.AssetType;
import com.exchange.enums.OrderType;
import com.exchange.enums.StopOrderStatus;
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
public class StopOrderResponse {
    private Long id;
    private Long portfolioId;
    private String portfolioName;
    private Long assetId;
    private String symbol;
    private String assetName;
    private AssetType assetType;
    private OrderType type;
    private BigDecimal stopPrice;
    private BigDecimal quantity;
    private StopOrderStatus status;
    private BigDecimal filledPrice;
    private LocalDateTime triggeredAt;
    private LocalDateTime filledAt;
    private LocalDateTime createdAt;
    private BigDecimal currentPrice;

    public static StopOrderResponse fromEntity(StopOrder order) {
        return StopOrderResponse.builder()
                .id(order.getId())
                .portfolioId(order.getPortfolio().getId())
                .portfolioName(order.getPortfolio().getName())
                .assetId(order.getAsset().getId())
                .symbol(order.getAsset().getSymbol())
                .assetName(order.getAsset().getName())
                .assetType(order.getAsset().getType())
                .type(order.getType())
                .stopPrice(order.getStopPrice())
                .quantity(order.getQuantity())
                .status(order.getStatus())
                .filledPrice(order.getFilledPrice())
                .triggeredAt(order.getTriggeredAt())
                .filledAt(order.getFilledAt())
                .createdAt(order.getCreatedAt())
                .build();
    }

    public static StopOrderResponse fromEntityWithCurrentPrice(StopOrder order, BigDecimal currentPrice) {
        StopOrderResponse response = fromEntity(order);
        response.setCurrentPrice(currentPrice);
        return response;
    }
}

