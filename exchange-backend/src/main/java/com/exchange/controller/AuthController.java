package com.exchange.controller;

import com.exchange.dto.request.LoginRequest;
import com.exchange.dto.request.RegisterRequest;
import com.exchange.dto.response.ApiResponse;
import com.exchange.dto.response.AuthResponse;
import com.exchange.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        // TODO: Implement login endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        // TODO: Implement register endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader("Authorization") String token) {
        // TODO: Implement logout endpoint
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

