package com.exchange.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

    private final DataSource dataSource;
    private final RedisConnectionFactory redisConnectionFactory;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", "UP");
        result.put("timestamp", Instant.now().toString());
        result.put("database", checkDatabase());
        result.put("redis", checkRedis());
        return ResponseEntity.ok(result);
    }

    private Map<String, Object> checkDatabase() {
        Map<String, Object> db = new LinkedHashMap<>();
        try (Connection conn = dataSource.getConnection()) {
            db.put("status", conn.isValid(2) ? "UP" : "DOWN");
        } catch (Exception e) {
            db.put("status", "DOWN");
            db.put("error", e.getMessage());
        }
        return db;
    }

    private Map<String, Object> checkRedis() {
        Map<String, Object> redis = new LinkedHashMap<>();
        try {
            String pong = redisConnectionFactory.getConnection().ping();
            redis.put("status", pong != null ? "UP" : "DOWN");
        } catch (Exception e) {
            redis.put("status", "DOWN");
            redis.put("error", e.getMessage());
        }
        return redis;
    }
}
