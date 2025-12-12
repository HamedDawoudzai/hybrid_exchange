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

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByPortfolioIdOrderByCreatedAtDesc(Long portfolioId);

    Page<Order> findByPortfolioId(Long portfolioId, Pageable pageable);

    @Query("SELECT o FROM Order o JOIN FETCH o.asset WHERE o.portfolio.id = :portfolioId ORDER BY o.createdAt DESC")
    List<Order> findByPortfolioIdWithAsset(@Param("portfolioId") Long portfolioId);

    List<Order> findByPortfolioIdAndStatus(Long portfolioId, OrderStatus status);

    @Query("SELECT o FROM Order o WHERE o.portfolio.user.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
}

