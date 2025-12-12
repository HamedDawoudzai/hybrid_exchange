package com.exchange.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String tokenType;
    private Long userId;
    private String username;
    private String email;

    public static AuthResponse of(String token, Long userId, String username, String email) {
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(userId)
                .username(username)
                .email(email)
                .build();
    }
}

