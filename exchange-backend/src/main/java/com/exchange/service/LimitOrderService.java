package com.exchange.service;

import com.exchange.dto.request.LimitOrderRequest;
import com.exchange.dto.response.LimitOrderResponse;
import com.exchange.enums.LimitOrderStatus;

import java.util.List;

public interface LimitOrderService {

    LimitOrderResponse createLimitOrder(Long userId, LimitOrderRequest request);

    List<LimitOrderResponse> getLimitOrders(Long userId, LimitOrderStatus status);

    List<LimitOrderResponse> getAllLimitOrders(Long userId);

    LimitOrderResponse cancelLimitOrder(Long userId, Long orderId);

    void checkAndFillLimitOrders();
}

