package com.exchange.service.impl;

import com.exchange.dto.request.ChatMessageRequest;
import com.exchange.dto.request.ChatRequest;
import com.exchange.dto.response.ChatResponse;
import com.exchange.exception.BadRequestException;
import com.exchange.service.ChatService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ChatServiceImpl implements ChatService {

    private final WebClient ollamaWebClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.ollama.model:llama3.2}")
    private String model;

    public ChatServiceImpl(@Qualifier("ollamaWebClient") WebClient ollamaWebClient) {
        this.ollamaWebClient = ollamaWebClient;
    }

    @Override
    public ChatResponse chat(ChatRequest request) {
        List<ObjectNode> messages = request.getMessages().stream()
                .map(this::toOllamaMessage)
                .collect(Collectors.toList());

        ObjectNode body = objectMapper.createObjectNode();
        body.put("model", model);
        body.put("stream", false);
        body.set("messages", objectMapper.valueToTree(messages));

        JsonNode response;
        try {
            response = ollamaWebClient.post()
                    .uri("/api/chat")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();
        } catch (Exception e) {
            log.warn("Ollama request failed: {}", e.getMessage());
            throw new BadRequestException(
                    "Ollama is not reachable. Ensure Ollama is running (ollama serve) and the model is pulled (ollama pull " + model + ").");
        }

        if (response == null) {
            throw new BadRequestException("No response from AI service");
        }

        JsonNode messageNode = response.get("message");
        String content = messageNode != null && messageNode.has("content")
                ? messageNode.get("content").asText()
                : "";

        return ChatResponse.builder()
                .content(content)
                .build();
    }

    private ObjectNode toOllamaMessage(ChatMessageRequest msg) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put("role", msg.getRole());
        node.put("content", msg.getContent());
        return node;
    }
}
