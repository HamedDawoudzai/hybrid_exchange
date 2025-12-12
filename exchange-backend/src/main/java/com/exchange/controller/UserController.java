package com.exchange.controller;

import com.exchange.dto.response.ApiResponse;
import com.exchange.dto.response.UserResponse;
import com.exchange.security.UserPrincipal;
import com.exchange.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserResponse user = userService.getCurrentUser(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}