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
        // TODO: Implement create portfolio endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PortfolioResponse>>> getUserPortfolios(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        // TODO: Implement get user portfolios endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PortfolioResponse>> getPortfolio(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        // TODO: Implement get portfolio endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @PostMapping("/{id}/deposit")
    public ResponseEntity<ApiResponse<PortfolioResponse>> deposit(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @Valid @RequestBody DepositRequest request) {
        // TODO: Implement deposit endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePortfolio(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        // TODO: Implement delete portfolio endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

