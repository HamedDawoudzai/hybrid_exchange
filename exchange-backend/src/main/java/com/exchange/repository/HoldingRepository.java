package com.exchange.repository;

import com.exchange.entity.Holding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HoldingRepository extends JpaRepository<Holding, Long> {

    List<Holding> findByPortfolioId(Long portfolioId);

    @Query("SELECT h FROM Holding h JOIN FETCH h.asset WHERE h.portfolio.id = :portfolioId")
    List<Holding> findByPortfolioIdWithAsset(@Param("portfolioId") Long portfolioId);

    Optional<Holding> findByPortfolioIdAndAssetId(Long portfolioId, Long assetId);

    @Query("SELECT h FROM Holding h WHERE h.portfolio.id = :portfolioId AND h.asset.symbol = :symbol")
    Optional<Holding> findByPortfolioIdAndAssetSymbol(@Param("portfolioId") Long portfolioId, @Param("symbol") String symbol);
}

