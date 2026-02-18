package com.exchange.repository;

import com.exchange.entity.WatchlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link WatchlistItem}.
 * Provides access to user watchlists and asset lookups.
 */
@Repository
public interface WatchlistRepository extends JpaRepository<WatchlistItem, Long> {

    /** Fetches all watchlist items for a user with asset eagerly loaded, newest first. */
    @Query("SELECT w FROM WatchlistItem w JOIN FETCH w.asset WHERE w.user.id = :userId ORDER BY w.createdAt DESC")
    List<WatchlistItem> findByUserIdWithAsset(@Param("userId") Long userId);

    /** Returns all watchlist items for the given user. */
    List<WatchlistItem> findByUserId(Long userId);

    /** Finds a watchlist item by user id and asset id. */
    Optional<WatchlistItem> findByUserIdAndAssetId(Long userId, Long assetId);

    /** Finds a watchlist item by user id and asset symbol. */
    Optional<WatchlistItem> findByUserIdAndAssetSymbol(Long userId, String symbol);

    /** Returns true if the user has the given asset in their watchlist. */
    boolean existsByUserIdAndAssetId(Long userId, Long assetId);

    /** Returns true if the user has an asset with the given symbol in their watchlist. */
    boolean existsByUserIdAndAssetSymbol(Long userId, String symbol);

    /** Removes the watchlist entry for the given user and asset id. */
    void deleteByUserIdAndAssetId(Long userId, Long assetId);

    /** Removes the watchlist entry for the given user and asset symbol. */
    void deleteByUserIdAndAssetSymbol(Long userId, String symbol);
}
