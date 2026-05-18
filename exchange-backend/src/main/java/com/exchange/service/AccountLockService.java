package com.exchange.service;

import com.exchange.entity.Holding;
import com.exchange.entity.User;
import com.exchange.exception.ResourceNotFoundException;
import com.exchange.repository.HoldingRepository;
import com.exchange.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

/**
 * Centralizes pessimistic row locks for user cash and holdings.
 * Always acquire User before Holding to avoid deadlocks.
 */
@Service
@RequiredArgsConstructor
public class AccountLockService {

    private final UserRepository userRepository;
    private final HoldingRepository holdingRepository;

    public User requireUserForUpdate(Long userId) {
        Long id = Objects.requireNonNull(userId, "userId must not be null");
        return userRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public Optional<Holding> findHoldingForUpdate(Long portfolioId, Long assetId) {
        return holdingRepository.findByPortfolioIdAndAssetIdForUpdate(
                Objects.requireNonNull(portfolioId, "portfolioId must not be null"),
                Objects.requireNonNull(assetId, "assetId must not be null"));
    }
}
