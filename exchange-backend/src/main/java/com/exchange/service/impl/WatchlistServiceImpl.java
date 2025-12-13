package com.exchange.service.impl;

import com.exchange.dto.response.PriceResponse;
import com.exchange.dto.response.WatchlistItemResponse;
import com.exchange.entity.Asset;
import com.exchange.entity.User;
import com.exchange.entity.WatchlistItem;
import com.exchange.exception.BadRequestException;
import com.exchange.exception.ResourceNotFoundException;
import com.exchange.repository.AssetRepository;
import com.exchange.repository.UserRepository;
import com.exchange.repository.WatchlistRepository;
import com.exchange.service.PriceService;
import com.exchange.service.WatchlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WatchlistServiceImpl implements WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final PriceService priceService;

    @Override
    public List<WatchlistItemResponse> getWatchlist(Long userId) {
        List<WatchlistItem> items = watchlistRepository.findByUserIdWithAsset(userId);
        List<WatchlistItemResponse> responses = new ArrayList<>();

        for (WatchlistItem item : items) {
            try {
                PriceResponse priceResponse = priceService.getPrice(
                        item.getAsset().getSymbol(),
                        item.getAsset().getType()
                );

                BigDecimal currentPrice = priceResponse.getPrice();
                BigDecimal priceChange24h = priceResponse.getChange() != null ? priceResponse.getChange() : BigDecimal.ZERO;
                BigDecimal priceChangePercent24h = priceResponse.getChangePercent() != null 
                        ? priceResponse.getChangePercent() 
                        : BigDecimal.ZERO;

                responses.add(WatchlistItemResponse.fromEntityWithPrice(
                        item,
                        currentPrice,
                        priceChange24h,
                        priceChangePercent24h
                ));
            } catch (Exception e) {
                log.warn("Failed to fetch price for watchlist item {}: {}", item.getAsset().getSymbol(), e.getMessage());
                // Return item without price data
                responses.add(WatchlistItemResponse.fromEntity(item));
            }
        }

        return responses;
    }

    @Override
    @Transactional
    public WatchlistItemResponse addToWatchlist(Long userId, String symbol) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Asset asset = assetRepository.findBySymbol(symbol.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Asset", "symbol", symbol));

        if (watchlistRepository.existsByUserIdAndAssetId(userId, asset.getId())) {
            throw new BadRequestException(symbol + " is already in your watchlist");
        }

        WatchlistItem item = WatchlistItem.builder()
                .user(user)
                .asset(asset)
                .build();

        WatchlistItem saved = watchlistRepository.save(item);
        log.info("Added {} to watchlist for user {}", symbol, userId);

        // Fetch current price for response
        try {
            PriceResponse priceResponse = priceService.getPrice(symbol, asset.getType());
            return WatchlistItemResponse.fromEntityWithPrice(
                    saved,
                    priceResponse.getPrice(),
                    priceResponse.getChange(),
                    priceResponse.getChangePercent()
            );
        } catch (Exception e) {
            return WatchlistItemResponse.fromEntity(saved);
        }
    }

    @Override
    @Transactional
    public void removeFromWatchlist(Long userId, String symbol) {
        WatchlistItem item = watchlistRepository.findByUserIdAndAssetSymbol(userId, symbol.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist item", "symbol", symbol));

        watchlistRepository.delete(item);
        log.info("Removed {} from watchlist for user {}", symbol, userId);
    }

    @Override
    public boolean isInWatchlist(Long userId, String symbol) {
        return watchlistRepository.existsByUserIdAndAssetSymbol(userId, symbol.toUpperCase());
    }
}

