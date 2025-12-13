package com.exchange.controller;

import com.exchange.dto.response.ApiResponse;
import com.exchange.dto.response.UserResponse;
import com.exchange.dto.request.DepositRequest;
import com.exchange.exception.BadRequestException;
import com.exchange.security.UserPrincipal;
import com.exchange.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private static final BigDecimal MAX_DEPOSIT = new BigDecimal("1000000000"); // 1B cap

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserResponse user = userService.getCurrentUser(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PostMapping("/cash/deposit")
    public ResponseEntity<ApiResponse<UserResponse>> depositCash(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody @jakarta.validation.Valid DepositRequest request) {

        BigDecimal amount = request.getAmount();
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Deposit amount must be positive");
        }
        if (amount.compareTo(MAX_DEPOSIT) > 0) {
            throw new BadRequestException("Deposit amount exceeds the allowed limit");
        }

        UserResponse user = userService.depositCash(userPrincipal.getId(), amount);
        return ResponseEntity.ok(ApiResponse.success("Deposit successful", user));
    }

    @PostMapping("/cash/withdraw")
    public ResponseEntity<ApiResponse<UserResponse>> withdrawCash(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody @jakarta.validation.Valid DepositRequest request) {

        BigDecimal amount = request.getAmount();
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Withdrawal amount must be positive");
        }

        UserResponse user = userService.withdrawCash(userPrincipal.getId(), amount);
        return ResponseEntity.ok(ApiResponse.success("Withdrawal successful", user));
    }
}