package com.exchange.service.impl;

import com.exchange.dto.request.CreatePortfolioRequest;
import com.exchange.dto.response.HoldingResponse;
import com.exchange.dto.response.PortfolioResponse;
import com.exchange.entity.Holding;
import com.exchange.entity.Portfolio;
import com.exchange.entity.User;
import com.exchange.exception.BadRequestException;
import com.exchange.exception.ResourceNotFoundException;
import com.exchange.repository.HoldingRepository;
import com.exchange.repository.PortfolioRepository;
import com.exchange.repository.UserRepository;
import com.exchange.service.PortfolioService;
import com.exchange.service.PriceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;
    private final HoldingRepository holdingRepository;
    private final PriceService priceService;

    @Override
    @Transactional
    public PortfolioResponse createPortfolio(Long userId, CreatePortfolioRequest request) {
        User user = userRepository.findById(Objects.requireNonNull(userId, "userId must not be null"))
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Portfolio portfolio = Portfolio.builder()
                .name(request.getName())
                .description(request.getDescription())
                .user(user)
                .build();

        portfolio = portfolioRepository.save(Objects.requireNonNull(portfolio, "portfolio must not be null"));

        log.info("Portfolio created: ID {}, User ID {}, Name {}", portfolio.getId(), userId, request.getName());

        // include totalValue (zero on create; holdings added later)
        return PortfolioResponse.fromEntityWithHoldings(portfolio, null, BigDecimal.ZERO);
    }

    @Override
    public List<PortfolioResponse> getUserPortfolios(Long userId) {
        List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);
        return portfolios.stream()
                .map(this::computePortfolioSummary)
                .collect(Collectors.toList());
    }

    @Override
    public PortfolioResponse getPortfolioById(Long userId, Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", "id", portfolioId));
        return computePortfolioSummary(portfolio);
    }

    @Override
    public PortfolioResponse getPortfolioWithHoldings(Long userId, Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", "id", portfolioId));

        List<Holding> holdings = holdingRepository.findByPortfolioIdWithAsset(portfolioId);

        List<HoldingResponse> holdingResponses = new ArrayList<>();
        BigDecimal totalValue = BigDecimal.ZERO;

        for (Holding holding : holdings) {
            BigDecimal currentPrice = null;
            BigDecimal marketValue = null;
            BigDecimal gainLoss = null;
            BigDecimal gainLossPercent = null;

            try {
                currentPrice = priceService.getCurrentPrice(
                        holding.getAsset().getSymbol(),
                        holding.getAsset().getType());

                marketValue = holding.getQuantity()
                        .multiply(currentPrice)
                        .setScale(4, RoundingMode.HALF_UP);

                gainLoss = marketValue.subtract(
                        holding.getQuantity().multiply(holding.getAverageBuyPrice())
                                .setScale(4, RoundingMode.HALF_UP));

                gainLossPercent = holding.getAverageBuyPrice().compareTo(BigDecimal.ZERO) > 0
                        ? gainLoss.divide(
                                holding.getQuantity().multiply(holding.getAverageBuyPrice()),
                                4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"))
                        : BigDecimal.ZERO;

                totalValue = totalValue.add(marketValue);
            } catch (Exception e) {
                log.warn("Failed to fetch price for {}: {}", holding.getAsset().getSymbol(), e.getMessage());
                // Use cost basis as fallback for value calculation
                marketValue = holding.getQuantity().multiply(holding.getAverageBuyPrice())
                        .setScale(4, RoundingMode.HALF_UP);
                totalValue = totalValue.add(marketValue);
            }

            // Always add the holding to the response, even if price fetch failed
            holdingResponses.add(HoldingResponse.builder()
                    .id(holding.getId())
                    .symbol(holding.getAsset().getSymbol())
                    .assetName(holding.getAsset().getName())
                    .assetType(holding.getAsset().getType())
                    .quantity(holding.getQuantity())
                    .averageBuyPrice(holding.getAverageBuyPrice())
                    .currentPrice(currentPrice)
                    .currentValue(marketValue)
                    .profitLoss(gainLoss)
                    .profitLossPercent(gainLossPercent)
                    .build());
        }

        return PortfolioResponse.fromEntityWithHoldings(portfolio, holdingResponses, totalValue);
    }

    @Override
    @Transactional
    public void deletePortfolio(Long userId, Long portfolioId) {
        Portfolio portfolio = portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", "id", portfolioId));

        // Only block deletion if there are active holdings (positions)
        // Orders are historical records and will be cascade deleted
        if (!portfolio.getHoldings().isEmpty()) {
            throw new BadRequestException("Cannot delete portfolio with existing holdings. Sell all positions first.");
        }

        // Orders will be cascade deleted due to CascadeType.ALL on the relationship
        int orderCount = portfolio.getOrders().size();
        
        portfolioRepository.delete(portfolio);

        log.info("Portfolio deleted: ID {}, User ID {}, Orders cascade deleted: {}", portfolioId, userId, orderCount);
    }

    private PortfolioResponse computePortfolioSummary(Portfolio portfolio) {
        // For list/summary: compute total from holdings (with current prices)
        List<Holding> holdings = holdingRepository.findByPortfolioIdWithAsset(portfolio.getId());
        List<HoldingResponse> holdingResponses = new ArrayList<>();
        BigDecimal totalValue = BigDecimal.ZERO;

        for (Holding holding : holdings) {
            BigDecimal currentPrice = null;
            BigDecimal marketValue = null;
            BigDecimal gainLoss = null;
            BigDecimal gainLossPercent = null;

            try {
                currentPrice = priceService.getCurrentPrice(
                        holding.getAsset().getSymbol(),
                        holding.getAsset().getType());

                marketValue = holding.getQuantity()
                        .multiply(currentPrice)
                        .setScale(4, RoundingMode.HALF_UP);

                gainLoss = marketValue.subtract(
                        holding.getQuantity().multiply(holding.getAverageBuyPrice())
                                .setScale(4, RoundingMode.HALF_UP));

                gainLossPercent = holding.getAverageBuyPrice().compareTo(BigDecimal.ZERO) > 0
                        ? gainLoss.divide(
                                holding.getQuantity().multiply(holding.getAverageBuyPrice()),
                                4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"))
                        : BigDecimal.ZERO;

                totalValue = totalValue.add(marketValue);
            } catch (Exception e) {
                log.warn("Failed to price holding {}: {}", holding.getAsset().getSymbol(), e.getMessage());
                // Use cost basis as fallback for value calculation
                marketValue = holding.getQuantity().multiply(holding.getAverageBuyPrice())
                        .setScale(4, RoundingMode.HALF_UP);
                totalValue = totalValue.add(marketValue);
            }

            // Always include holdings in the response, even if price fetch failed
            holdingResponses.add(HoldingResponse.builder()
                    .id(holding.getId())
                    .symbol(holding.getAsset().getSymbol())
                    .assetName(holding.getAsset().getName())
                    .assetType(holding.getAsset().getType())
                    .quantity(holding.getQuantity())
                    .averageBuyPrice(holding.getAverageBuyPrice())
                    .currentPrice(currentPrice)
                    .currentValue(marketValue)
                    .profitLoss(gainLoss)
                    .profitLossPercent(gainLossPercent)
                    .build());
        }

        return PortfolioResponse.fromEntityWithHoldings(portfolio, holdingResponses, totalValue);
    }
}