package com.exchange.service.impl;

import com.exchange.dto.request.OrderRequest;
import com.exchange.dto.response.OrderResponse;
import com.exchange.repository.HoldingRepository;
import com.exchange.repository.OrderRepository;
import com.exchange.repository.PortfolioRepository;
import com.exchange.service.AssetService;
import com.exchange.service.OrderService;
import com.exchange.service.PriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final PortfolioRepository portfolioRepository;
    private final HoldingRepository holdingRepository;
    private final AssetService assetService;
    private final PriceService priceService;

    @Override
    public OrderResponse placeOrder(Long userId, OrderRequest request) {
        // TODO: Implement place order
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public List<OrderResponse> getPortfolioOrders(Long userId, Long portfolioId) {
        // TODO: Implement get portfolio orders
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public List<OrderResponse> getUserOrders(Long userId) {
        // TODO: Implement get user orders
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public OrderResponse getOrderById(Long userId, Long orderId) {
        // TODO: Implement get order by id
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

