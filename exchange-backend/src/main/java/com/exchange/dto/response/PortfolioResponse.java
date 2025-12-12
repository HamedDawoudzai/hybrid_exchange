package com.exchange.dto.response;

import com.exchange.entity.Portfolio;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal cashBalance;
    private BigDecimal totalValue;
    private List<HoldingResponse> holdings;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PortfolioResponse fromEntity(Portfolio portfolio) {
        return PortfolioResponse.builder()
                .id(portfolio.getId())
                .name(portfolio.getName())
                .description(portfolio.getDescription())
                .cashBalance(portfolio.getCashBalance())
                .createdAt(portfolio.getCreatedAt())
                .updatedAt(portfolio.getUpdatedAt())
                .build();
    }

    public static PortfolioResponse fromEntityWithHoldings(Portfolio portfolio, List<HoldingResponse> holdings, BigDecimal totalValue) {
        return PortfolioResponse.builder()
                .id(portfolio.getId())
                .name(portfolio.getName())
                .description(portfolio.getDescription())
                .cashBalance(portfolio.getCashBalance())
                .totalValue(totalValue)
                .holdings(holdings)
                .createdAt(portfolio.getCreatedAt())
                .updatedAt(portfolio.getUpdatedAt())
                .build();
    }
}

