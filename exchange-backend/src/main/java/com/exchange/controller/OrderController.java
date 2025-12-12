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
        OrderResponse orderResponse = orderService.placeOrder(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully", orderResponse));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getUserOrders(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<OrderResponse> orders = orderService.getUserOrders(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/portfolio/{portfolioId}")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getPortfolioOrders(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long portfolioId) {
        List<OrderResponse> orders = orderService.getPortfolioOrders(userPrincipal.getId(), portfolioId);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        OrderResponse order = orderService.getOrderById(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }
}