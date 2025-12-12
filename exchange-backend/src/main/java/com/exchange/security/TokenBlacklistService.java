package com.exchange.security;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

/** Redis-backed JWT blacklist */
@Component
public class TokenBlacklistService {
    private static final String PREFIX = "blacklist:jwt:";
    private final StringRedisTemplate stringRedisTemplate;

    public TokenBlacklistService(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    public void blacklist(String token, Date expiresAt) {
        Objects.requireNonNull(token, "token must not be null");
        Objects.requireNonNull(expiresAt, "expiresAt must not be null");
        long ttlMillis = expiresAt.getTime() - System.currentTimeMillis();
        if (ttlMillis <= 0) return;
        stringRedisTemplate.opsForValue().set(PREFIX + token, "1", ttlMillis, TimeUnit.MILLISECONDS);
    }

    public boolean isBlacklisted(String token) {
        if (token == null || token.isEmpty()) return false;
        return stringRedisTemplate.opsForValue().get(PREFIX + token) != null;
    }
}