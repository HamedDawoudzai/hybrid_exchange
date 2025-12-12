package com.exchange.service.impl;

import com.exchange.dto.request.LoginRequest;
import com.exchange.dto.request.RegisterRequest;
import com.exchange.dto.response.AuthResponse;
import com.exchange.repository.UserRepository;
import com.exchange.security.JwtTokenProvider;
import com.exchange.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse login(LoginRequest request) {
        // TODO: Implement login logic
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        // TODO: Implement registration logic
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public void logout(String token) {
        // TODO: Implement logout logic (token blacklisting)
    }
}

