package com.exchange.service.impl;

import com.exchange.dto.response.UserResponse;
import com.exchange.entity.User;
import com.exchange.repository.UserRepository;
import com.exchange.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User findById(Long id) {
        // TODO: Implement find by id
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public User findByUsername(String username) {
        // TODO: Implement find by username
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public User findByEmail(String email) {
        // TODO: Implement find by email
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public UserResponse getCurrentUser(Long userId) {
        // TODO: Implement get current user
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
}

