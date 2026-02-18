package com.exchange.repository;

import com.exchange.entity.LimitOrder;
import com.exchange.enums.LimitOrderStatus;
import com.exchange.enums.OrderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Spring Data JPA repository for {@link LimitOrder}.
 * Manages buy/sell limit orders with price and optional expiry.
 */
@Repository
public interface LimitOrderRepository extends JpaRepository<LimitOrder, Long> {

    /** Returns all limit orders for a user, newest first. */
    List<LimitOrder> findByUserIdOrderByCreatedAtDesc(Long userId);

    /** Returns limit orders for a user filtered by status, newest first. */
    List<LimitOrder> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, LimitOrderStatus status);

    /** Fetches limit orders for a user with asset eagerly loaded, newest first. */
    @Query("SELECT lo FROM LimitOrder lo JOIN FETCH lo.asset WHERE lo.user.id = :userId ORDER BY lo.createdAt DESC")
    List<LimitOrder> findByUserIdWithAsset(@Param("userId") Long userId);

    /** Fetches limit orders for a user by status with asset loaded. */
    @Query("SELECT lo FROM LimitOrder lo JOIN FETCH lo.asset WHERE lo.user.id = :userId AND lo.status = :status ORDER BY lo.createdAt DESC")
    List<LimitOrder> findByUserIdAndStatusWithAsset(@Param("userId") Long userId, @Param("status") LimitOrderStatus status);

    /** Fetches all limit orders with the given status, with asset and portfolio (e.g. for matching engine). */
    @Query("SELECT lo FROM LimitOrder lo JOIN FETCH lo.asset JOIN FETCH lo.portfolio WHERE lo.status = :status")
    List<LimitOrder> findAllPendingWithDetails(@Param("status") LimitOrderStatus status);

    /** Finds pending limit orders by status, type (BUY/SELL), and asset symbol. */
    @Query("SELECT lo FROM LimitOrder lo JOIN FETCH lo.asset WHERE lo.status = :status AND lo.type = :type AND lo.asset.symbol = :symbol")
    List<LimitOrder> findPendingByTypeAndSymbol(
            @Param("status") LimitOrderStatus status,
            @Param("type") OrderType type,
            @Param("symbol") String symbol
    );

    /** Returns limit orders for a portfolio with the given status. */
    List<LimitOrder> findByPortfolioIdAndStatus(Long portfolioId, LimitOrderStatus status);

    /** Deletes all limit orders belonging to the given portfolio. */
    void deleteByPortfolioId(Long portfolioId);

    /** Sums reserved amount for a user by status and order type (e.g. for balance checks). */
    @Query("SELECT COALESCE(SUM(lo.reservedAmount), 0) FROM LimitOrder lo WHERE lo.user.id = :userId AND lo.status = :status AND lo.type = :type")
    BigDecimal sumReservedAmountByUserIdAndStatusAndType(
            @Param("userId") Long userId,
            @Param("status") LimitOrderStatus status,
            @Param("type") OrderType type
    );
}

