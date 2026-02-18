package com.exchange.repository;

import com.exchange.entity.StopOrder;
import com.exchange.enums.StopOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for {@link StopOrder}.
 * Manages stop-loss and stop-limit orders that trigger at a price level.
 */
@Repository
public interface StopOrderRepository extends JpaRepository<StopOrder, Long> {

    /** Fetches all stop orders for a user with asset eagerly loaded, newest first. */
    @Query("SELECT so FROM StopOrder so JOIN FETCH so.asset WHERE so.user.id = :userId ORDER BY so.createdAt DESC")
    List<StopOrder> findByUserIdWithAsset(@Param("userId") Long userId);

    /** Fetches stop orders for a user filtered by status, with asset loaded. */
    @Query("SELECT so FROM StopOrder so JOIN FETCH so.asset WHERE so.user.id = :userId AND so.status = :status ORDER BY so.createdAt DESC")
    List<StopOrder> findByUserIdAndStatusWithAsset(@Param("userId") Long userId, @Param("status") StopOrderStatus status);

    /** Fetches all stop orders with the given status, with asset and portfolio loaded (e.g. for processing). */
    @Query("SELECT so FROM StopOrder so JOIN FETCH so.asset JOIN FETCH so.portfolio WHERE so.status = :status")
    List<StopOrder> findAllPendingWithDetails(@Param("status") StopOrderStatus status);

    /** Returns stop orders for a portfolio with the given status. */
    List<StopOrder> findByPortfolioIdAndStatus(Long portfolioId, StopOrderStatus status);

    /** Deletes all stop orders belonging to the given portfolio. */
    void deleteByPortfolioId(Long portfolioId);
}

