package com.exchange.controller;

import com.exchange.dto.request.OrderRequest;
import com.exchange.dto.response.ApiResponse;
import com.exchange.dto.response.OrderResponse;
import com.exchange.security.UserPrincipal;
import com.exchange.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody OrderRequest request) {
        // TODO: Implement place order endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getUserOrders(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        // TODO: Implement get user orders endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/portfolio/{portfolioId}")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getPortfolioOrders(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long portfolioId) {
        // TODO: Implement get portfolio orders endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        // TODO: Implement get order endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

