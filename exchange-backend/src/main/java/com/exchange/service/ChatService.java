package com.exchange.service;

import com.exchange.dto.request.ChatRequest;
import com.exchange.dto.response.ChatResponse;

/**
 * Service for AI-powered investing chatbot.
 * Designed to support future RAG and vector DB integration.
 */
public interface ChatService {

    ChatResponse chat(ChatRequest request);
}
