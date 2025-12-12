package com.exchange.dto.response;

import com.exchange.entity.Order;
import com.exchange.enums.AssetType;
import com.exchange.enums.OrderStatus;
import com.exchange.enums.OrderType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;
    private String symbol;
    private String assetName;
    private AssetType assetType;
    private OrderType type;
    private OrderStatus status;
    private BigDecimal quantity;
    private BigDecimal pricePerUnit;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;

    public static OrderResponse fromEntity(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .symbol(order.getAsset().getSymbol())
                .assetName(order.getAsset().getName())
                .assetType(order.getAsset().getType())
                .type(order.getType())
                .status(order.getStatus())
                .quantity(order.getQuantity())
                .pricePerUnit(order.getPricePerUnit())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .build();
    }
}

