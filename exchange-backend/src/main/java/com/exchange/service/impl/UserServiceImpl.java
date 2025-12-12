package com.exchange.service.impl;

import com.exchange.dto.response.UserResponse;
import com.exchange.entity.User;
import com.exchange.exception.BadRequestException;
import com.exchange.exception.ResourceNotFoundException;
import com.exchange.repository.UserRepository;
import com.exchange.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final BigDecimal MAX_DEPOSIT = new BigDecimal("1000000"); // optional dummy cap

    private final UserRepository userRepository;

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
        return UserResponse.fromEntity(user);
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
        User saved = userRepository.save(user);
        return UserResponse.fromEntity(saved);
    }
}