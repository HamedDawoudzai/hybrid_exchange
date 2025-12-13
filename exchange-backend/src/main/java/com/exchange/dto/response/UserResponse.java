package com.exchange.dto.response;

import com.exchange.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private BigDecimal cashBalance;
    private BigDecimal reservedCash; // Cash reserved for pending limit buy orders
    private BigDecimal totalDeposits;
    private BigDecimal totalWithdrawals;
    private LocalDateTime createdAt;

    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .cashBalance(user.getCashBalance())
                .reservedCash(BigDecimal.ZERO) // Will be set by service
                .totalDeposits(user.getTotalDeposits())
                .totalWithdrawals(user.getTotalWithdrawals())
                .createdAt(user.getCreatedAt())
                .build();
    }
}

