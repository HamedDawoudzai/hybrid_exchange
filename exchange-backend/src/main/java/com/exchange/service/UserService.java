package com.exchange.service;

import com.exchange.dto.response.UserResponse;
import com.exchange.entity.User;

public interface UserService {

    User findById(Long id);

    User findByUsername(String username);

    User findByEmail(String email);

    UserResponse getCurrentUser(Long userId);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}

