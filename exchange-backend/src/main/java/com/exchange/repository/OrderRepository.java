package com.exchange.repository;

import com.exchange.entity.Order;
import com.exchange.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for {@link Order}.
 * Handles trade orders (market orders) for portfolios.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /** Returns orders for a portfolio, newest first. */
    List<Order> findByPortfolioIdOrderByCreatedAtDesc(Long portfolioId);

    /** Returns a paginated list of orders for a portfolio. */
    Page<Order> findByPortfolioId(Long portfolioId, Pageable pageable);

    /** Fetches orders for a portfolio with asset eagerly loaded, newest first. */
    @Query("SELECT o FROM Order o JOIN FETCH o.asset WHERE o.portfolio.id = :portfolioId ORDER BY o.createdAt DESC")
    List<Order> findByPortfolioIdWithAsset(@Param("portfolioId") Long portfolioId);

    /** Returns orders for a portfolio filtered by status. */
    List<Order> findByPortfolioIdAndStatus(Long portfolioId, OrderStatus status);

    /** Returns all orders for a user across portfolios, newest first. */
    @Query("SELECT o FROM Order o WHERE o.portfolio.user.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    /** Deletes all orders belonging to the given portfolio. */
    void deleteByPortfolioId(Long portfolioId);
}

