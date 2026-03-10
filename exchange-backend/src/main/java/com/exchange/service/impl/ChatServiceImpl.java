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

    private final WebClient openaiWebClient;

    public ChatServiceImpl(@Qualifier("openaiWebClient") WebClient openaiWebClient) {
        this.openaiWebClient = openaiWebClient;
    }
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.openai.api-key:}")
    private String openaiApiKey;

    @Value("${app.openai.model:gpt-4o-mini}")
    private String model;

    @Override
    public ChatResponse chat(ChatRequest request) {
        if (openaiApiKey == null || openaiApiKey.isBlank()) {
            throw new BadRequestException("OpenAI API key is not configured. Set OPENAI_API_KEY environment variable.");
        }

        List<ObjectNode> openaiMessages = request.getMessages().stream()
                .map(this::toOpenAIMessage)
                .collect(Collectors.toList());

        ObjectNode body = objectMapper.createObjectNode();
        body.put("model", model);
        body.set("messages", objectMapper.valueToTree(openaiMessages));

        JsonNode response = openaiWebClient.post()
                .uri("/chat/completions")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response == null) {
            throw new BadRequestException("No response from AI service");
        }

        JsonNode choices = response.get("choices");
        if (choices == null || !choices.isArray() || choices.isEmpty()) {
            throw new BadRequestException("Invalid AI response");
        }

        JsonNode firstChoice = choices.get(0);
        JsonNode message = firstChoice != null ? firstChoice.get("message") : null;
        String content = message != null && message.has("content") ? message.get("content").asText() : "";

        return ChatResponse.builder()
                .content(content)
                .build();
    }

    private ObjectNode toOpenAIMessage(ChatMessageRequest msg) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put("role", msg.getRole());
        node.put("content", msg.getContent());
        return node;
    }
}
