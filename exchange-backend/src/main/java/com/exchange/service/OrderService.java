package com.exchange.service;

import com.exchange.dto.request.OrderRequest;
import com.exchange.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse placeOrder(Long userId, OrderRequest request);

    List<OrderResponse> getPortfolioOrders(Long userId, Long portfolioId);

    List<OrderResponse> getUserOrders(Long userId);

    OrderResponse getOrderById(Long userId, Long orderId);
}

