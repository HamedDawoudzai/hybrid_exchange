package com.exchange.service;

import com.exchange.dto.request.LoginRequest;
import com.exchange.dto.request.RegisterRequest;
import com.exchange.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    void logout(String token);
}

