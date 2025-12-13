package com.exchange.repository;

import com.exchange.entity.WatchlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistRepository extends JpaRepository<WatchlistItem, Long> {

    @Query("SELECT w FROM WatchlistItem w JOIN FETCH w.asset WHERE w.user.id = :userId ORDER BY w.createdAt DESC")
    List<WatchlistItem> findByUserIdWithAsset(@Param("userId") Long userId);

    List<WatchlistItem> findByUserId(Long userId);

    Optional<WatchlistItem> findByUserIdAndAssetId(Long userId, Long assetId);

    Optional<WatchlistItem> findByUserIdAndAssetSymbol(Long userId, String symbol);

    boolean existsByUserIdAndAssetId(Long userId, Long assetId);

    boolean existsByUserIdAndAssetSymbol(Long userId, String symbol);

    void deleteByUserIdAndAssetId(Long userId, Long assetId);

    void deleteByUserIdAndAssetSymbol(Long userId, String symbol);
}

