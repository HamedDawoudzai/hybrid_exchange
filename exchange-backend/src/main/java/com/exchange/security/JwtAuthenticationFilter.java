package com.exchange.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter
 * Intercepts requests to validate JWT tokens and set authentication context.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        // TODO: Implement JWT authentication filter logic
        // 1. Extract JWT from request header
        // 2. Validate token
        // 3. Load user details
        // 4. Set authentication in SecurityContext
        
        filterChain.doFilter(request, response);
    }

    /**
     * Extract JWT token from request Authorization header
     * @param request the HTTP request
     * @return JWT token or null
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        // TODO: Implement JWT extraction from Authorization header
        return null;
    }
}
