package com.exchange.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePortfolioRequest {

    @NotBlank(message = "Portfolio name is required")
    private String name;

    private String description;

    @PositiveOrZero(message = "Initial balance must be zero or positive")
    private BigDecimal initialBalance;
}

