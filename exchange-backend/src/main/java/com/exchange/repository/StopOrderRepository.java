package com.exchange.repository;

import com.exchange.entity.StopOrder;
import com.exchange.enums.OrderType;
import com.exchange.enums.StopOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StopOrderRepository extends JpaRepository<StopOrder, Long> {

    @Query("SELECT so FROM StopOrder so JOIN FETCH so.asset WHERE so.user.id = :userId ORDER BY so.createdAt DESC")
    List<StopOrder> findByUserIdWithAsset(@Param("userId") Long userId);

    @Query("SELECT so FROM StopOrder so JOIN FETCH so.asset WHERE so.user.id = :userId AND so.status = :status ORDER BY so.createdAt DESC")
    List<StopOrder> findByUserIdAndStatusWithAsset(@Param("userId") Long userId, @Param("status") StopOrderStatus status);

    @Query("SELECT so FROM StopOrder so JOIN FETCH so.asset JOIN FETCH so.portfolio WHERE so.status = :status")
    List<StopOrder> findAllPendingWithDetails(@Param("status") StopOrderStatus status);

    List<StopOrder> findByPortfolioIdAndStatus(Long portfolioId, StopOrderStatus status);

    void deleteByPortfolioId(Long portfolioId);
}

