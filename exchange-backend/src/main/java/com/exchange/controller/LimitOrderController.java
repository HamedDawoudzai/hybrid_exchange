package com.exchange.controller;

import com.exchange.dto.request.LimitOrderRequest;
import com.exchange.dto.response.ApiResponse;
import com.exchange.dto.response.LimitOrderResponse;
import com.exchange.enums.LimitOrderStatus;
import com.exchange.security.UserPrincipal;
import com.exchange.service.LimitOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/limit-orders")
@RequiredArgsConstructor
public class LimitOrderController {

    private final LimitOrderService limitOrderService;

    @PostMapping
    public ResponseEntity<ApiResponse<LimitOrderResponse>> createLimitOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody LimitOrderRequest request) {
        LimitOrderResponse response = limitOrderService.createLimitOrder(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Limit order created", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LimitOrderResponse>>> getLimitOrders(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) LimitOrderStatus status) {
        List<LimitOrderResponse> orders;
        if (status != null) {
            orders = limitOrderService.getLimitOrders(userPrincipal.getId(), status);
        } else {
            orders = limitOrderService.getAllLimitOrders(userPrincipal.getId());
        }
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<LimitOrderResponse>>> getPendingLimitOrders(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<LimitOrderResponse> orders = limitOrderService.getLimitOrders(
                userPrincipal.getId(), LimitOrderStatus.PENDING);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<LimitOrderResponse>> cancelLimitOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long orderId) {
        LimitOrderResponse response = limitOrderService.cancelLimitOrder(userPrincipal.getId(), orderId);
        return ResponseEntity.ok(ApiResponse.success("Limit order cancelled", response));
    }
}

