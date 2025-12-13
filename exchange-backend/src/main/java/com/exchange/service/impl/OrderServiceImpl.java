package com.exchange.service.impl;

import com.exchange.dto.request.OrderRequest;
import com.exchange.dto.response.OrderResponse;
import com.exchange.entity.Asset;
import com.exchange.entity.Holding;
import com.exchange.entity.Order;
import com.exchange.entity.Portfolio;
import com.exchange.enums.OrderStatus;
import com.exchange.enums.OrderType;
import com.exchange.exception.BadRequestException;
import com.exchange.exception.InsufficientBalanceException;
import com.exchange.exception.ResourceNotFoundException;
import com.exchange.repository.HoldingRepository;
import com.exchange.repository.OrderRepository;
import com.exchange.repository.PortfolioRepository;
import com.exchange.repository.UserRepository;
import com.exchange.service.AssetService;
import com.exchange.service.OrderService;
import com.exchange.service.PriceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final PortfolioRepository portfolioRepository;
    private final HoldingRepository holdingRepository;
    private final UserRepository userRepository;
    private final AssetService assetService;
    private final PriceService priceService;

    @Override
    @Transactional
    public OrderResponse placeOrder(Long userId, OrderRequest request) {
        Portfolio portfolio = portfolioRepository.findByIdAndUserId(request.getPortfolioId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", "id", request.getPortfolioId()));

        var user = portfolio.getUser();

        Asset asset = assetService.findBySymbol(request.getSymbol());

        BigDecimal currentPrice = priceService.getCurrentPrice(request.getSymbol(), asset.getType());

        BigDecimal requestedQuantity = request.getQuantity();
        BigDecimal usedQuantity = requestedQuantity;
        BigDecimal totalAmount = usedQuantity
                .multiply(currentPrice)
                .setScale(4, RoundingMode.HALF_UP);
        BigDecimal executionPrice = currentPrice; // Default to current price, will be updated for SELL orders

        if (request.getType() == OrderType.BUY) {
            BigDecimal cashBalance = user.getCashBalance();
            // Cap quantity to what the user can actually afford at current price to avoid failures on 100% slider
            BigDecimal maxAffordableQty = cashBalance.divide(currentPrice, 6, RoundingMode.FLOOR);
            if (maxAffordableQty.compareTo(BigDecimal.ZERO) <= 0) {
                throw new InsufficientBalanceException(
                        String.format("Insufficient balance. Required: %s, Available: %s",
                                totalAmount, cashBalance));
            }
            if (requestedQuantity.compareTo(maxAffordableQty) > 0) {
                usedQuantity = maxAffordableQty;
                totalAmount = usedQuantity.multiply(currentPrice).setScale(4, RoundingMode.HALF_UP);
            }
            BigDecimal difference = totalAmount.subtract(cashBalance);

            // Allow for small floating-point rounding errors (e.g., $0.01 difference)
            if (difference.compareTo(BigDecimal.ZERO) > 0 && difference.compareTo(new BigDecimal("0.01")) <= 0) {
                totalAmount = cashBalance; // Cap to available balance
            }

            if (cashBalance.compareTo(totalAmount) < 0) {
                throw new InsufficientBalanceException(
                        String.format("Insufficient balance. Required: %s, Available: %s",
                                totalAmount, cashBalance));
            }

            user.setCashBalance(cashBalance.subtract(totalAmount));

            Holding holding = holdingRepository.findByPortfolioIdAndAssetId(
                            portfolio.getId(), asset.getId())
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
            BigDecimal totalCost = holding.getQuantity()
                    .multiply(avgPrice)
                    .add(totalAmount);
            BigDecimal newQuantity = holding.getQuantity().add(usedQuantity);
            BigDecimal newAveragePrice = newQuantity.compareTo(BigDecimal.ZERO) > 0
                    ? totalCost.divide(newQuantity, 4, RoundingMode.HALF_UP)
                    : currentPrice;

            holding.setQuantity(newQuantity);
            holding.setAverageBuyPrice(newAveragePrice);

            holdingRepository.save(holding);

        } else if (request.getType() == OrderType.SELL) {
            Holding holding = holdingRepository.findByPortfolioIdAndAssetId(
                            portfolio.getId(), asset.getId())
                    .orElseThrow(() -> new InsufficientBalanceException(
                            String.format("Insufficient holdings. You don't own any %s", request.getSymbol())));

            if (holding.getQuantity().compareTo(requestedQuantity) < 0) {
                throw new InsufficientBalanceException(
                        String.format("Insufficient holdings. Required: %s, Available: %s",
                                requestedQuantity, holding.getQuantity()));
            }

            // For SELL orders, use the current market price
            // This ensures users get the price they see (or close to it, accounting for market movement)
            // If they see a loss and sell, they'll realize that loss (or current market price if it recovered)
            executionPrice = currentPrice;
            
            // Recalculate totalAmount using current market price
            totalAmount = requestedQuantity.multiply(executionPrice).setScale(4, RoundingMode.HALF_UP);

            BigDecimal newQuantity = holding.getQuantity().subtract(requestedQuantity);
            if (newQuantity.compareTo(BigDecimal.ZERO) == 0) {
                holdingRepository.delete(holding);
            } else {
                holding.setQuantity(newQuantity);
                holdingRepository.save(holding);
            }

            user.setCashBalance(user.getCashBalance().add(totalAmount));

        } else {
            throw new BadRequestException("Invalid order type: " + request.getType());
        }

        userRepository.save(user);

        Order order = Order.builder()
                .portfolio(portfolio)
                .asset(asset)
                .type(request.getType())
                .status(OrderStatus.COMPLETED)
                .quantity(usedQuantity)
                .pricePerUnit(executionPrice)
                .totalAmount(totalAmount)
                .build();

        Order savedOrder = Objects.requireNonNull(orderRepository.save(Objects.requireNonNull(order, "order must not be null")), "saved order must not be null");

        log.info("Order placed successfully: Order ID {}, User ID {}, Type {}, Symbol {}, Quantity {}",
                savedOrder.getId(), userId, request.getType(), request.getSymbol(), request.getQuantity());

        return OrderResponse.fromEntity(savedOrder);
    }

    @Override
    public List<OrderResponse> getPortfolioOrders(Long userId, Long portfolioId) {
        portfolioRepository.findByIdAndUserId(portfolioId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", "id", portfolioId));

        return orderRepository.findByPortfolioIdWithAsset(portfolioId).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse getOrderById(Long userId, Long orderId) {
        Order order = orderRepository.findById(Objects.requireNonNull(orderId, "orderId must not be null"))
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getPortfolio().getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Order", "id", orderId);
        }

        return OrderResponse.fromEntity(order);
    }
}