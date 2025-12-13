package com.exchange.dto.request;

import com.exchange.enums.OrderType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LimitOrderRequest {
    
    @NotNull(message = "Portfolio ID is required")
    private Long portfolioId;

    @NotNull(message = "Symbol is required")
    private String symbol;

    @NotNull(message = "Order type is required")
    private OrderType type;

    @NotNull(message = "Target price is required")
    @Positive(message = "Target price must be positive")
    private BigDecimal targetPrice;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private BigDecimal quantity;
}

