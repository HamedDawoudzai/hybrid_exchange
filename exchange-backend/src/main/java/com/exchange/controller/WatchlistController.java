package com.exchange.controller;

import com.exchange.dto.response.ApiResponse;
import com.exchange.dto.response.WatchlistItemResponse;
import com.exchange.security.UserPrincipal;
import com.exchange.service.WatchlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
public class WatchlistController {

    private final WatchlistService watchlistService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WatchlistItemResponse>>> getWatchlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<WatchlistItemResponse> watchlist = watchlistService.getWatchlist(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(watchlist));
    }

    @PostMapping("/{symbol}")
    public ResponseEntity<ApiResponse<WatchlistItemResponse>> addToWatchlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String symbol) {
        WatchlistItemResponse item = watchlistService.addToWatchlist(userPrincipal.getId(), symbol);
        return ResponseEntity.ok(ApiResponse.success("Added to watchlist", item));
    }

    @DeleteMapping("/{symbol}")
    public ResponseEntity<ApiResponse<Void>> removeFromWatchlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String symbol) {
        watchlistService.removeFromWatchlist(userPrincipal.getId(), symbol);
        return ResponseEntity.ok(ApiResponse.success("Removed from watchlist", null));
    }

    @GetMapping("/check/{symbol}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkWatchlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String symbol) {
        boolean inWatchlist = watchlistService.isInWatchlist(userPrincipal.getId(), symbol);
        return ResponseEntity.ok(ApiResponse.success(Map.of("inWatchlist", inWatchlist)));
    }
}

