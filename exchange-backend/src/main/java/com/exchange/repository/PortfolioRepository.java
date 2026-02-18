package com.exchange.repository;

import com.exchange.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Portfolio}.
 * Manages user portfolios and their holdings.
 */
@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    /** Returns all portfolios for the given user. */
    List<Portfolio> findByUserId(Long userId);

    /** Fetches a portfolio by id with holdings eagerly loaded. */
    @Query("SELECT p FROM Portfolio p LEFT JOIN FETCH p.holdings WHERE p.id = :id")
    Optional<Portfolio> findByIdWithHoldings(@Param("id") Long id);

    /** Finds a portfolio by id only if it belongs to the given user (for authorization). */
    @Query("SELECT p FROM Portfolio p WHERE p.id = :portfolioId AND p.user.id = :userId")
    Optional<Portfolio> findByIdAndUserId(@Param("portfolioId") Long portfolioId, @Param("userId") Long userId);
}

