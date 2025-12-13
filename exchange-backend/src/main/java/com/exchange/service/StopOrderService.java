package com.exchange.service;

import com.exchange.dto.request.StopOrderRequest;
import com.exchange.dto.response.StopOrderResponse;
import com.exchange.enums.StopOrderStatus;

import java.util.List;

public interface StopOrderService {

    StopOrderResponse createStopOrder(Long userId, StopOrderRequest request);

    List<StopOrderResponse> getStopOrders(Long userId, StopOrderStatus status);

    List<StopOrderResponse> getAllStopOrders(Long userId);

    StopOrderResponse cancelStopOrder(Long userId, Long orderId);

    void checkAndTriggerStopOrders();
}

