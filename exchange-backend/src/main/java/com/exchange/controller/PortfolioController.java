package com.exchange.controller;

import com.exchange.dto.request.CreatePortfolioRequest;
import com.exchange.dto.request.DepositRequest;
import com.exchange.dto.response.ApiResponse;
import com.exchange.dto.response.PortfolioResponse;
import com.exchange.security.UserPrincipal;
import com.exchange.service.PortfolioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @PostMapping
    public ResponseEntity<ApiResponse<PortfolioResponse>> createPortfolio(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreatePortfolioRequest request) {
        PortfolioResponse portfolio = portfolioService.createPortfolio(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Portfolio created successfully", portfolio));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PortfolioResponse>>> getUserPortfolios(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<PortfolioResponse> portfolios = portfolioService.getUserPortfolios(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(portfolios));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PortfolioResponse>> getPortfolio(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        PortfolioResponse portfolio = portfolioService.getPortfolioWithHoldings(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(portfolio));
    }

    @PostMapping("/{id}/deposit")
    public ResponseEntity<ApiResponse<PortfolioResponse>> deposit(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @Valid @RequestBody DepositRequest request) {
        PortfolioResponse portfolio = portfolioService.deposit(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Deposit successful", portfolio));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePortfolio(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        portfolioService.deletePortfolio(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Portfolio deleted successfully", null));
    }
}