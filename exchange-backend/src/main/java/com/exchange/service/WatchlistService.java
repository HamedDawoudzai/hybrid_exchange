package com.exchange.service;

import com.exchange.dto.response.WatchlistItemResponse;

import java.util.List;

public interface WatchlistService {

    List<WatchlistItemResponse> getWatchlist(Long userId);

    WatchlistItemResponse addToWatchlist(Long userId, String symbol);

    void removeFromWatchlist(Long userId, String symbol);

    boolean isInWatchlist(Long userId, String symbol);
}

