package com.exchange.repository;

import com.exchange.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    List<Portfolio> findByUserId(Long userId);

    @Query("SELECT p FROM Portfolio p LEFT JOIN FETCH p.holdings WHERE p.id = :id")
    Optional<Portfolio> findByIdWithHoldings(@Param("id") Long id);

    @Query("SELECT p FROM Portfolio p WHERE p.id = :portfolioId AND p.user.id = :userId")
    Optional<Portfolio> findByIdAndUserId(@Param("portfolioId") Long portfolioId, @Param("userId") Long userId);
}

