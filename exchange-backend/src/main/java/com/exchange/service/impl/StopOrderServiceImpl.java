package com.exchange.service.impl;

import com.exchange.dto.request.StopOrderRequest;
import com.exchange.dto.response.StopOrderResponse;
import com.exchange.entity.Asset;
import com.exchange.entity.Holding;
import com.exchange.entity.StopOrder;
import com.exchange.entity.User;
import com.exchange.enums.OrderStatus;
import com.exchange.enums.OrderType;
import com.exchange.enums.StopOrderStatus;
import com.exchange.exception.BadRequestException;
import com.exchange.exception.InsufficientBalanceException;
import com.exchange.exception.ResourceNotFoundException;
import com.exchange.repository.*;
import com.exchange.service.PriceService;
import com.exchange.service.StopOrderService;
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
public class StopOrderServiceImpl implements StopOrderService {

    private final StopOrderRepository stopOrderRepository;
    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;
    private final AssetRepository assetRepository;
    private final HoldingRepository holdingRepository;
    private final OrderRepository orderRepository;
    private final PriceService priceService;

    @Override
    @Transactional
    public StopOrderResponse createStopOrder(Long userId, StopOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        var portfolio = portfolioRepository.findByIdAndUserId(request.getPortfolioId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", "id", request.getPortfolioId()));

        Asset asset = assetRepository.findBySymbol(request.getSymbol().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Asset", "symbol", request.getSymbol()));

        if (request.getType() != OrderType.SELL) {
            throw new BadRequestException("Stop orders currently support SELL (stop-loss) only");
        }

        // Validate holdings at creation
        Holding holding = holdingRepository.findByPortfolioIdAndAssetId(portfolio.getId(), asset.getId())
                .orElseThrow(() -> new InsufficientBalanceException(
                        String.format("No holdings of %s found in portfolio", request.getSymbol())));

        if (holding.getQuantity().compareTo(request.getQuantity()) < 0) {
            throw new InsufficientBalanceException(
                    String.format("Insufficient holdings. Required: %s, Available: %s",
                            request.getQuantity(), holding.getQuantity()));
        }

        StopOrder stopOrder = StopOrder.builder()
                .user(user)
                .portfolio(portfolio)
                .asset(asset)
                .type(OrderType.SELL)
                .stopPrice(request.getStopPrice())
                .quantity(request.getQuantity())
                .status(StopOrderStatus.PENDING)
                .build();

        StopOrder saved = stopOrderRepository.save(stopOrder);
        log.info("Created stop-loss SELL order for {} @ {} (Order ID: {})",
                request.getSymbol(), request.getStopPrice(), saved.getId());

        return StopOrderResponse.fromEntity(saved);
    }

    @Override
    public List<StopOrderResponse> getStopOrders(Long userId, StopOrderStatus status) {
        List<StopOrder> orders = stopOrderRepository.findByUserIdAndStatusWithAsset(userId, status);
        return mapWithCurrentPrice(orders);
    }

    @Override
    public List<StopOrderResponse> getAllStopOrders(Long userId) {
        List<StopOrder> orders = stopOrderRepository.findByUserIdWithAsset(userId);
        return mapWithCurrentPrice(orders);
    }

    @Override
    @Transactional
    public StopOrderResponse cancelStopOrder(Long userId, Long orderId) {
        StopOrder order = stopOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Stop Order", "id", orderId));

        if (!order.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Stop Order", "id", orderId);
        }

        if (order.getStatus() != StopOrderStatus.PENDING) {
            throw new BadRequestException("Cannot cancel order with status: " + order.getStatus());
        }

        order.setStatus(StopOrderStatus.CANCELLED);
        StopOrder saved = stopOrderRepository.save(order);
        log.info("Cancelled stop order {}", orderId);

        return StopOrderResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public void checkAndTriggerStopOrders() {
        List<StopOrder> pendingOrders = stopOrderRepository.findAllPendingWithDetails(StopOrderStatus.PENDING);

        for (StopOrder order : pendingOrders) {
            try {
                BigDecimal currentPrice = priceService.getCurrentPrice(
                        order.getAsset().getSymbol(),
                        order.getAsset().getType()
                );

                boolean shouldTrigger = false;

                // Stop-loss SELL: trigger when price <= stopPrice
                if (order.getType() == OrderType.SELL) {
                    shouldTrigger = currentPrice.compareTo(order.getStopPrice()) <= 0;
                }

                if (shouldTrigger) {
                    triggerStopOrder(order, currentPrice);
                }

            } catch (Exception e) {
                log.warn("Failed to check stop order {}: {}", order.getId(), e.getMessage());
            }
        }
    }

    @Transactional
    protected void triggerStopOrder(StopOrder stopOrder, BigDecimal fillPrice) {
        var user = stopOrder.getUser();
        var portfolio = stopOrder.getPortfolio();
        var asset = stopOrder.getAsset();

        // Validate holdings at trigger time
        Holding holding = holdingRepository.findByPortfolioIdAndAssetId(portfolio.getId(), asset.getId())
                .orElse(null);

        if (holding == null || holding.getQuantity().compareTo(stopOrder.getQuantity()) < 0) {
            // Insufficient holdings; cancel
            stopOrder.setStatus(StopOrderStatus.CANCELLED);
            stopOrderRepository.save(stopOrder);
            log.warn("Stop order {} cancelled due to insufficient holdings at trigger", stopOrder.getId());
            return;
        }

        // Execute as market sell at current price
        BigDecimal totalAmount = fillPrice.multiply(stopOrder.getQuantity()).setScale(4, RoundingMode.HALF_UP);

        BigDecimal newQty = holding.getQuantity().subtract(stopOrder.getQuantity());
        if (newQty.compareTo(BigDecimal.ZERO) == 0) {
            holdingRepository.delete(holding);
        } else {
            holding.setQuantity(newQty);
            holdingRepository.save(holding);
        }

        user.setCashBalance(user.getCashBalance().add(totalAmount));
        userRepository.save(user);

        // Record order history
        var orderRecord = com.exchange.entity.Order.builder()
                .portfolio(portfolio)
                .asset(asset)
                .type(OrderType.SELL)
                .status(OrderStatus.COMPLETED)
                .quantity(stopOrder.getQuantity())
                .pricePerUnit(fillPrice)
                .totalAmount(totalAmount)
                .build();
        orderRepository.save(orderRecord);

        stopOrder.setStatus(StopOrderStatus.FILLED);
        stopOrder.setTriggeredAt(LocalDateTime.now());
        stopOrder.setFilledAt(LocalDateTime.now());
        stopOrder.setFilledPrice(fillPrice);
        stopOrderRepository.save(stopOrder);

        log.info("Filled stop-loss SELL order {} for {} {} @ {}", stopOrder.getId(),
                stopOrder.getQuantity(), asset.getSymbol(), fillPrice);
    }

    private List<StopOrderResponse> mapWithCurrentPrice(List<StopOrder> orders) {
        return orders.stream()
                .map(order -> {
                    try {
                        BigDecimal currentPrice = priceService.getCurrentPrice(
                                order.getAsset().getSymbol(),
                                order.getAsset().getType()
                        );
                        return StopOrderResponse.fromEntityWithCurrentPrice(order, currentPrice);
                    } catch (Exception e) {
                        return StopOrderResponse.fromEntity(order);
                    }
                })
                .collect(Collectors.toList());
    }
}

