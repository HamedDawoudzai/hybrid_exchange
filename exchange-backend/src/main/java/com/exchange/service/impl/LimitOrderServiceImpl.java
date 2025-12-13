package com.exchange.service.impl;

import com.exchange.dto.request.LimitOrderRequest;
import com.exchange.dto.response.LimitOrderResponse;
import com.exchange.entity.*;
import com.exchange.enums.LimitOrderStatus;
import com.exchange.enums.OrderStatus;
import com.exchange.enums.OrderType;
import com.exchange.exception.BadRequestException;
import com.exchange.exception.InsufficientBalanceException;
import com.exchange.exception.ResourceNotFoundException;
import com.exchange.repository.*;
import com.exchange.service.LimitOrderService;
import com.exchange.service.PriceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LimitOrderServiceImpl implements LimitOrderService {

    private final LimitOrderRepository limitOrderRepository;
    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;
    private final AssetRepository assetRepository;
    private final HoldingRepository holdingRepository;
    private final OrderRepository orderRepository;
    private final PriceService priceService;

    @Override
    @Transactional
    public LimitOrderResponse createLimitOrder(Long userId, LimitOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Portfolio portfolio = portfolioRepository.findByIdAndUserId(request.getPortfolioId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", "id", request.getPortfolioId()));

        Asset asset = assetRepository.findBySymbol(request.getSymbol().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Asset", "symbol", request.getSymbol()));

        BigDecimal reservedAmount = BigDecimal.ZERO;

        if (request.getType() == OrderType.BUY) {
            // For BUY orders, reserve cash = targetPrice * quantity
            reservedAmount = request.getTargetPrice()
                    .multiply(request.getQuantity())
                    .setScale(4, RoundingMode.HALF_UP);

            if (user.getCashBalance().compareTo(reservedAmount) < 0) {
                throw new InsufficientBalanceException(
                        String.format("Insufficient cash balance. Required: %s, Available: %s",
                                reservedAmount, user.getCashBalance()));
            }

            // Reserve the cash
            user.setCashBalance(user.getCashBalance().subtract(reservedAmount));
            userRepository.save(user);
            log.info("Reserved {} for limit buy order", reservedAmount);

        } else if (request.getType() == OrderType.SELL) {
            // For SELL orders, verify user has enough holdings
            Holding holding = holdingRepository.findByPortfolioIdAndAssetId(portfolio.getId(), asset.getId())
                    .orElseThrow(() -> new InsufficientBalanceException(
                            String.format("No holdings of %s found in portfolio", request.getSymbol())));

            if (holding.getQuantity().compareTo(request.getQuantity()) < 0) {
                throw new InsufficientBalanceException(
                        String.format("Insufficient holdings. Required: %s, Available: %s",
                                request.getQuantity(), holding.getQuantity()));
            }

            // Note: For sell orders, we don't reserve holdings - we check at fill time
            // This allows the user to still hold the asset
            reservedAmount = BigDecimal.ZERO;
        }

        LimitOrder limitOrder = LimitOrder.builder()
                .user(user)
                .portfolio(portfolio)
                .asset(asset)
                .type(request.getType())
                .targetPrice(request.getTargetPrice())
                .quantity(request.getQuantity())
                .reservedAmount(reservedAmount)
                .status(LimitOrderStatus.PENDING)
                .build();

        LimitOrder saved = limitOrderRepository.save(limitOrder);
        log.info("Created limit {} order for {} {} @ {} (Order ID: {})",
                request.getType(), request.getQuantity(), request.getSymbol(),
                request.getTargetPrice(), saved.getId());

        return LimitOrderResponse.fromEntity(saved);
    }

    @Override
    public List<LimitOrderResponse> getLimitOrders(Long userId, LimitOrderStatus status) {
        List<LimitOrder> orders = limitOrderRepository.findByUserIdAndStatusWithAsset(userId, status);
        return orders.stream()
                .map(order -> {
                    try {
                        BigDecimal currentPrice = priceService.getCurrentPrice(
                                order.getAsset().getSymbol(),
                                order.getAsset().getType()
                        );
                        return LimitOrderResponse.fromEntityWithCurrentPrice(order, currentPrice);
                    } catch (Exception e) {
                        return LimitOrderResponse.fromEntity(order);
                    }
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<LimitOrderResponse> getAllLimitOrders(Long userId) {
        List<LimitOrder> orders = limitOrderRepository.findByUserIdWithAsset(userId);
        return orders.stream()
                .map(order -> {
                    try {
                        BigDecimal currentPrice = priceService.getCurrentPrice(
                                order.getAsset().getSymbol(),
                                order.getAsset().getType()
                        );
                        return LimitOrderResponse.fromEntityWithCurrentPrice(order, currentPrice);
                    } catch (Exception e) {
                        return LimitOrderResponse.fromEntity(order);
                    }
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LimitOrderResponse cancelLimitOrder(Long userId, Long orderId) {
        LimitOrder limitOrder = limitOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Limit Order", "id", orderId));

        if (!limitOrder.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Limit Order", "id", orderId);
        }

        if (limitOrder.getStatus() != LimitOrderStatus.PENDING) {
            throw new BadRequestException("Cannot cancel order with status: " + limitOrder.getStatus());
        }

        // Refund reserved amount for BUY orders
        if (limitOrder.getType() == OrderType.BUY && limitOrder.getReservedAmount().compareTo(BigDecimal.ZERO) > 0) {
            User user = limitOrder.getUser();
            user.setCashBalance(user.getCashBalance().add(limitOrder.getReservedAmount()));
            userRepository.save(user);
            log.info("Refunded {} to user {} for cancelled limit order {}",
                    limitOrder.getReservedAmount(), userId, orderId);
        }

        limitOrder.setStatus(LimitOrderStatus.CANCELLED);
        LimitOrder saved = limitOrderRepository.save(limitOrder);

        log.info("Cancelled limit order {}", orderId);
        return LimitOrderResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public void checkAndFillLimitOrders() {
        List<LimitOrder> pendingOrders = limitOrderRepository.findAllPendingWithDetails(LimitOrderStatus.PENDING);

        for (LimitOrder order : pendingOrders) {
            try {
                BigDecimal currentPrice = priceService.getCurrentPrice(
                        order.getAsset().getSymbol(),
                        order.getAsset().getType()
                );

                boolean shouldFill = false;

                if (order.getType() == OrderType.BUY) {
                    // Fill BUY order if current price <= target price
                    shouldFill = currentPrice.compareTo(order.getTargetPrice()) <= 0;
                } else if (order.getType() == OrderType.SELL) {
                    // Fill SELL order if current price >= target price
                    shouldFill = currentPrice.compareTo(order.getTargetPrice()) >= 0;
                }

                if (shouldFill) {
                    fillLimitOrder(order, currentPrice);
                }

            } catch (Exception e) {
                log.warn("Failed to check limit order {}: {}", order.getId(), e.getMessage());
            }
        }
    }

    @Transactional
    protected void fillLimitOrder(LimitOrder limitOrder, BigDecimal fillPrice) {
        User user = limitOrder.getUser();
        Portfolio portfolio = limitOrder.getPortfolio();
        Asset asset = limitOrder.getAsset();

        BigDecimal totalAmount = fillPrice.multiply(limitOrder.getQuantity()).setScale(4, RoundingMode.HALF_UP);

        if (limitOrder.getType() == OrderType.BUY) {
            // For BUY: use reserved amount, add to holdings
            // If fill price is lower than expected, refund the difference
            BigDecimal refund = limitOrder.getReservedAmount().subtract(totalAmount);
            if (refund.compareTo(BigDecimal.ZERO) > 0) {
                user.setCashBalance(user.getCashBalance().add(refund));
                log.info("Refunding {} due to favorable fill price", refund);
            }

            // Update or create holding
            Holding holding = holdingRepository.findByPortfolioIdAndAssetId(portfolio.getId(), asset.getId())
                    .orElse(Holding.builder()
                            .portfolio(portfolio)
                            .asset(asset)
                            .quantity(BigDecimal.ZERO)
                            .averageBuyPrice(BigDecimal.ZERO)
                            .build());

            // Handle null averageBuyPrice (shouldn't happen, but safety check)
            BigDecimal avgPrice = holding.getAverageBuyPrice() != null 
                    ? holding.getAverageBuyPrice() 
                    : BigDecimal.ZERO;
            BigDecimal oldCost = holding.getQuantity().multiply(avgPrice);
            BigDecimal newQuantity = holding.getQuantity().add(limitOrder.getQuantity());
            BigDecimal newAvgPrice = newQuantity.compareTo(BigDecimal.ZERO) > 0
                    ? oldCost.add(totalAmount).divide(newQuantity, 4, RoundingMode.HALF_UP)
                    : fillPrice;

            holding.setQuantity(newQuantity);
            holding.setAverageBuyPrice(newAvgPrice);
            holdingRepository.save(holding);

        } else if (limitOrder.getType() == OrderType.SELL) {
            // For SELL: reduce holdings, add cash
            Holding holding = holdingRepository.findByPortfolioIdAndAssetId(portfolio.getId(), asset.getId())
                    .orElse(null);

            if (holding == null || holding.getQuantity().compareTo(limitOrder.getQuantity()) < 0) {
                // Insufficient holdings at fill time - cancel the order
                limitOrder.setStatus(LimitOrderStatus.CANCELLED);
                limitOrderRepository.save(limitOrder);
                log.warn("Limit sell order {} cancelled due to insufficient holdings", limitOrder.getId());
                return;
            }

            BigDecimal newQuantity = holding.getQuantity().subtract(limitOrder.getQuantity());
            if (newQuantity.compareTo(BigDecimal.ZERO) == 0) {
                holdingRepository.delete(holding);
            } else {
                holding.setQuantity(newQuantity);
                holdingRepository.save(holding);
            }

            user.setCashBalance(user.getCashBalance().add(totalAmount));
        }

        userRepository.save(user);

        // Create order record
        Order order = Order.builder()
                .portfolio(portfolio)
                .asset(asset)
                .type(limitOrder.getType())
                .status(OrderStatus.COMPLETED)
                .quantity(limitOrder.getQuantity())
                .pricePerUnit(fillPrice)
                .totalAmount(totalAmount)
                .build();
        orderRepository.save(order);

        // Update limit order
        limitOrder.setStatus(LimitOrderStatus.FILLED);
        limitOrder.setFilledAt(LocalDateTime.now());
        limitOrder.setFilledPrice(fillPrice);
        limitOrderRepository.save(limitOrder);

        log.info("Filled limit {} order {} for {} {} @ {}",
                limitOrder.getType(), limitOrder.getId(),
                limitOrder.getQuantity(), asset.getSymbol(), fillPrice);
    }
}

