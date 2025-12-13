package com.exchange.scheduler;

import com.exchange.service.LimitOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class LimitOrderScheduler {

    private final LimitOrderService limitOrderService;

    /**
     * Check and fill pending limit orders every 30 seconds.
     * This runs in a separate thread to avoid blocking the main application.
     */
    @Scheduled(fixedRate = 30000) // Every 30 seconds
    public void checkLimitOrders() {
        log.debug("Checking pending limit orders...");
        try {
            limitOrderService.checkAndFillLimitOrders();
        } catch (Exception e) {
            log.error("Error checking limit orders: {}", e.getMessage(), e);
        }
    }
}

