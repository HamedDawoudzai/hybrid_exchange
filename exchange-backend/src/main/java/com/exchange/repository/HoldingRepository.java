package com.exchange.repository;

import com.exchange.entity.Holding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Holding}.
 * Manages asset positions (quantity) within a portfolio.
 */
@Repository
public interface HoldingRepository extends JpaRepository<Holding, Long> {

    /** Returns all holdings for the given portfolio. */
    List<Holding> findByPortfolioId(Long portfolioId);

    /** Fetches holdings for a portfolio with asset eagerly loaded. */
    @Query("SELECT h FROM Holding h JOIN FETCH h.asset WHERE h.portfolio.id = :portfolioId")
    List<Holding> findByPortfolioIdWithAsset(@Param("portfolioId") Long portfolioId);

    /** Finds the holding for a portfolio and asset by id. */
    Optional<Holding> findByPortfolioIdAndAssetId(Long portfolioId, Long assetId);

    /** Finds the holding for a portfolio and asset by symbol. */
    @Query("SELECT h FROM Holding h WHERE h.portfolio.id = :portfolioId AND h.asset.symbol = :symbol")
    Optional<Holding> findByPortfolioIdAndAssetSymbol(@Param("portfolioId") Long portfolioId, @Param("symbol") String symbol);
}

