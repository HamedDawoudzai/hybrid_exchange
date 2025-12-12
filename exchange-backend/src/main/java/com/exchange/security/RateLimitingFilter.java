package com.exchange.security;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Simple Redis-backed rate limiter for selected routes.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RedisTemplate<String, Object> redisTemplate;

    private final Map<String, RateLimitPolicy> policies = new HashMap<>();

    @PostConstruct
    void initPolicies() {
        policies.put("/api/auth/login", new RateLimitPolicy(5, Duration.ofMinutes(1)));
        policies.put("/api/auth/register", new RateLimitPolicy(5, Duration.ofMinutes(1)));
        policies.put("/api/prices", new RateLimitPolicy(120, Duration.ofMinutes(1)));
    }

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        return resolvePolicy(request) == null;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        RateLimitPolicy policy = resolvePolicy(request);
        if (policy == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String key = Objects.requireNonNull(buildKey(request, policy), "rate limit key");
        Duration window = Objects.requireNonNull(policy.window(), "rate limit window");
        Long count = redisTemplate.opsForValue().increment(key);
        if (count != null && count == 1L) {
            redisTemplate.expire(key, window);
        }

        if (count != null && count > policy.limit()) {
            log.warn("Rate limit exceeded for {} from {}", request.getRequestURI(), request.getRemoteAddr());
            response.sendError(HttpStatus.TOO_MANY_REQUESTS.value(), "Rate limit exceeded");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private RateLimitPolicy resolvePolicy(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return policies.entrySet().stream()
                .filter(entry -> uri.startsWith(entry.getKey()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse(null);
    }

    private String buildKey(HttpServletRequest request, RateLimitPolicy policy) {
        String path = policies.entrySet().stream()
                .filter(entry -> request.getRequestURI().startsWith(entry.getKey()))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse("unknown");
        String clientId = request.getRemoteAddr();
        return "rate:" + path + ":" + Objects.toString(clientId, "unknown");
    }

    private record RateLimitPolicy(long limit, Duration window) { }
}

