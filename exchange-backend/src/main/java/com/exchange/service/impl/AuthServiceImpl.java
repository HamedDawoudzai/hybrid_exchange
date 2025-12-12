package com.exchange.service.impl;

import com.exchange.dto.request.LoginRequest;
import com.exchange.dto.request.RegisterRequest;
import com.exchange.dto.response.AuthResponse;
import com.exchange.entity.User;
import com.exchange.exception.BadRequestException;
import com.exchange.repository.UserRepository;
import com.exchange.security.TokenBlacklistService;
import com.exchange.security.JwtTokenProvider;
import com.exchange.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .enabled(true)
                .build();

        user = userRepository.save(Objects.requireNonNull(user, "user must not be null"));

        String token = tokenProvider.generateToken(user.getId(), user.getUsername());

        log.info("User registered successfully: Username {}", request.getUsername());

        return AuthResponse.of(token, user.getId(), user.getUsername(), user.getEmail());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsernameOrEmail(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByUsernameOrEmail(
                    request.getUsernameOrEmail(), request.getUsernameOrEmail())
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            if (!user.getEnabled()) {
                throw new BadRequestException("Account is disabled");
            }

            String token = tokenProvider.generateToken(user.getId(), user.getUsername());

            log.info("User logged in successfully: Username {}", user.getUsername());

            return AuthResponse.of(token, user.getId(), user.getUsername(), user.getEmail());
        } catch (BadCredentialsException e) {
            throw new BadRequestException("Invalid username or password");
        }
    }

    @Override
    public void logout(String token) {
        try {
            var expiresAt = tokenProvider.getExpirationDate(token);
            if (expiresAt != null) {
                tokenBlacklistService.blacklist(token, expiresAt);
            }
            log.info("User logged out and token blacklisted");
        } catch (Exception e) {
            log.warn("Failed to blacklist token on logout: {}", e.getMessage());
        }
    }
}