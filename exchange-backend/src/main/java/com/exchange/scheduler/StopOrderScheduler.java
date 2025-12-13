package com.exchange.scheduler;

import com.exchange.service.StopOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class StopOrderScheduler {

    private final StopOrderService stopOrderService;

    /**
     * Check and trigger stop-loss orders every 30 seconds.
     */
    @Scheduled(fixedRate = 30000)
    public void checkStopOrders() {
        log.debug("Checking stop-loss orders...");
        try {
            stopOrderService.checkAndTriggerStopOrders();
        } catch (Exception e) {
            log.error("Error checking stop orders: {}", e.getMessage(), e);
        }
    }
}

