package com.exchange.entity;

import com.exchange.enums.OrderType;
import com.exchange.enums.StopOrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stop_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StopOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType type; // SELL only for stop-loss, but kept for flexibility

    @Column(name = "stop_price", nullable = false, precision = 19, scale = 4)
    private BigDecimal stopPrice;

    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal quantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StopOrderStatus status = StopOrderStatus.PENDING;

    @Column(name = "triggered_at")
    private LocalDateTime triggeredAt;

    @Column(name = "filled_at")
    private LocalDateTime filledAt;

    @Column(name = "filled_price", precision = 19, scale = 4)
    private BigDecimal filledPrice;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

