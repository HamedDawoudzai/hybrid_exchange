package com.exchange.service.impl;

import com.exchange.dto.response.UserResponse;
import com.exchange.entity.User;
import com.exchange.enums.LimitOrderStatus;
import com.exchange.enums.OrderType;
import com.exchange.exception.BadRequestException;
import com.exchange.exception.ResourceNotFoundException;
import com.exchange.repository.LimitOrderRepository;
import com.exchange.repository.UserRepository;
import com.exchange.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final BigDecimal MAX_DEPOSIT = new BigDecimal("1000000000"); // 1B cap

    private final UserRepository userRepository;
    private final LimitOrderRepository limitOrderRepository;

    @Override
    public User findById(Long id) {
        return userRepository.findById(Objects.requireNonNull(id, "id must not be null"))
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    @Override
    public UserResponse getCurrentUser(Long userId) {
        User user = findById(userId);
        UserResponse response = UserResponse.fromEntity(user);
        
        // Calculate reserved cash from pending limit buy orders
        BigDecimal reservedCash = limitOrderRepository.sumReservedAmountByUserIdAndStatusAndType(
                userId, LimitOrderStatus.PENDING, OrderType.BUY);
        if (reservedCash == null) {
            reservedCash = BigDecimal.ZERO;
        }
        response.setReservedCash(reservedCash);
        
        return response;
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public UserResponse depositCash(Long userId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Deposit amount must be positive");
        }
        if (amount.compareTo(MAX_DEPOSIT) > 0) {
            throw new BadRequestException("Deposit amount exceeds the allowed limit");
        }

        User user = findById(userId);
        user.setCashBalance(user.getCashBalance().add(amount));
        user.setTotalDeposits(user.getTotalDeposits().add(amount));
        User saved = userRepository.save(user);
        
        UserResponse response = UserResponse.fromEntity(saved);
        BigDecimal reservedCash = limitOrderRepository.sumReservedAmountByUserIdAndStatusAndType(
                userId, LimitOrderStatus.PENDING, OrderType.BUY);
        response.setReservedCash(reservedCash != null ? reservedCash : BigDecimal.ZERO);
        return response;
    }

    @Override
    public UserResponse withdrawCash(Long userId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Withdrawal amount must be positive");
        }

        User user = findById(userId);
        BigDecimal currentBalance = user.getCashBalance();

        if (currentBalance.compareTo(amount) < 0) {
            throw new BadRequestException(
                    String.format("Insufficient balance. Available: $%s, Requested: $%s", 
                            currentBalance.setScale(2), amount.setScale(2)));
        }

        user.setCashBalance(currentBalance.subtract(amount));
        user.setTotalWithdrawals(user.getTotalWithdrawals().add(amount));
        User saved = userRepository.save(user);
        
        UserResponse response = UserResponse.fromEntity(saved);
        BigDecimal reservedCash = limitOrderRepository.sumReservedAmountByUserIdAndStatusAndType(
                userId, LimitOrderStatus.PENDING, OrderType.BUY);
        response.setReservedCash(reservedCash != null ? reservedCash : BigDecimal.ZERO);
        return response;
    }
}