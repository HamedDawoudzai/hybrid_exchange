package com.exchange.controller;

import com.exchange.dto.request.ChatRequest;
import com.exchange.dto.response.ApiResponse;
import com.exchange.dto.response.ChatResponse;
import com.exchange.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ApiResponse<ChatResponse>> chat(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = chatService.chat(request);
        return ResponseEntity.ok(ApiResponse.success("OK", response));
    }
}
