package com.exchange.dto.request;

import com.exchange.enums.OrderType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    @NotNull(message = "Portfolio ID is required")
    private Long portfolioId;

    @NotBlank(message = "Asset symbol is required")
    private String symbol;

    @NotNull(message = "Order type is required")
    private OrderType type;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private BigDecimal quantity;
}

