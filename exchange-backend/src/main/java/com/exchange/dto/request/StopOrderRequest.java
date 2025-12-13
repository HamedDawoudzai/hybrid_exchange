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
public class StopOrderRequest {

    @NotNull(message = "Portfolio ID is required")
    private Long portfolioId;

    @NotNull(message = "Symbol is required")
    private String symbol;

    // For stop-loss we expect SELL, but keep type for future flexibility
    @NotNull(message = "Order type is required")
    private OrderType type;

    @NotNull(message = "Stop price is required")
    @Positive(message = "Stop price must be positive")
    private BigDecimal stopPrice;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private BigDecimal quantity;
}

