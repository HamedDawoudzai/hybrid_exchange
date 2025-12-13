package com.exchange.controller;

import com.exchange.dto.request.StopOrderRequest;
import com.exchange.dto.response.ApiResponse;
import com.exchange.dto.response.StopOrderResponse;
import com.exchange.enums.StopOrderStatus;
import com.exchange.security.UserPrincipal;
import com.exchange.service.StopOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stop-orders")
@RequiredArgsConstructor
public class StopOrderController {

    private final StopOrderService stopOrderService;

    @PostMapping
    public ResponseEntity<ApiResponse<StopOrderResponse>> createStopOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody StopOrderRequest request) {
        StopOrderResponse response = stopOrderService.createStopOrder(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Stop order created", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StopOrderResponse>>> getStopOrders(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) StopOrderStatus status) {
        List<StopOrderResponse> orders;
        if (status != null) {
            orders = stopOrderService.getStopOrders(userPrincipal.getId(), status);
        } else {
            orders = stopOrderService.getAllStopOrders(userPrincipal.getId());
        }
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<StopOrderResponse>>> getPendingStopOrders(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<StopOrderResponse> orders = stopOrderService.getStopOrders(
                userPrincipal.getId(), StopOrderStatus.PENDING);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<StopOrderResponse>> cancelStopOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long orderId) {
        StopOrderResponse response = stopOrderService.cancelStopOrder(userPrincipal.getId(), orderId);
        return ResponseEntity.ok(ApiResponse.success("Stop order cancelled", response));
    }
}

