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

@Repository
public interface LimitOrderRepository extends JpaRepository<LimitOrder, Long> {

    List<LimitOrder> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<LimitOrder> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, LimitOrderStatus status);

    @Query("SELECT lo FROM LimitOrder lo JOIN FETCH lo.asset WHERE lo.user.id = :userId ORDER BY lo.createdAt DESC")
    List<LimitOrder> findByUserIdWithAsset(@Param("userId") Long userId);

    @Query("SELECT lo FROM LimitOrder lo JOIN FETCH lo.asset WHERE lo.user.id = :userId AND lo.status = :status ORDER BY lo.createdAt DESC")
    List<LimitOrder> findByUserIdAndStatusWithAsset(@Param("userId") Long userId, @Param("status") LimitOrderStatus status);

    @Query("SELECT lo FROM LimitOrder lo JOIN FETCH lo.asset JOIN FETCH lo.portfolio WHERE lo.status = :status")
    List<LimitOrder> findAllPendingWithDetails(@Param("status") LimitOrderStatus status);

    @Query("SELECT lo FROM LimitOrder lo JOIN FETCH lo.asset WHERE lo.status = :status AND lo.type = :type AND lo.asset.symbol = :symbol")
    List<LimitOrder> findPendingByTypeAndSymbol(
            @Param("status") LimitOrderStatus status,
            @Param("type") OrderType type,
            @Param("symbol") String symbol
    );

    List<LimitOrder> findByPortfolioIdAndStatus(Long portfolioId, LimitOrderStatus status);

    void deleteByPortfolioId(Long portfolioId);

    @Query("SELECT COALESCE(SUM(lo.reservedAmount), 0) FROM LimitOrder lo WHERE lo.user.id = :userId AND lo.status = :status AND lo.type = :type")
    BigDecimal sumReservedAmountByUserIdAndStatusAndType(
            @Param("userId") Long userId,
            @Param("status") LimitOrderStatus status,
            @Param("type") OrderType type
    );
}

