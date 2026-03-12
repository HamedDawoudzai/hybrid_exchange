package com.exchange.service.impl;

import com.exchange.service.EmbeddingService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class OllamaEmbeddingService implements EmbeddingService {

    private final WebClient ollamaWebClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.ollama.embedding-model:all-minilm}")
    private String embeddingModel;

    public OllamaEmbeddingService(@Qualifier("ollamaWebClient") WebClient ollamaWebClient) {
        this.ollamaWebClient = ollamaWebClient;
    }

    @Override
    public double[] embed(String text) {
        ObjectNode body = objectMapper.createObjectNode();
        body.put("model", embeddingModel);
        body.put("input", text);

        JsonNode response = ollamaWebClient.post()
                .uri("/api/embed")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response == null || !response.has("embeddings")) {
            log.warn("Ollama embed returned no embeddings");
            return new double[0];
        }

        JsonNode embeddings = response.get("embeddings");
        if (!embeddings.isArray() || embeddings.isEmpty()) {
            return new double[0];
        }

        JsonNode first = embeddings.get(0);
        double[] vec = new double[first.size()];
        for (int i = 0; i < first.size(); i++) {
            vec[i] = first.get(i).asDouble();
        }
        return vec;
    }

    @Override
    public List<double[]> embedBatch(List<String> texts) {
        List<double[]> results = new ArrayList<>();
        for (String text : texts) {
            results.add(embed(text));
        }
        return results;
    }
}
