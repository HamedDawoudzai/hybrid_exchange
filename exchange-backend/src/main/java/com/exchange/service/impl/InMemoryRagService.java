package com.exchange.service.impl;

import com.exchange.dto.request.RagDocumentRequest;
import com.exchange.dto.response.RagSearchResult;
import com.exchange.service.EmbeddingService;
import com.exchange.service.RagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InMemoryRagService implements RagService {

    private final EmbeddingService embeddingService;

    @Value("${app.rag.similarity-threshold:0.5}")
    private double similarityThreshold;

    private final Map<String, StoredDocument> store = new ConcurrentHashMap<>();

    @Override
    public void upsertDocument(RagDocumentRequest request) {
        double[] embedding = embeddingService.embed(request.getContent());
        store.put(request.getDocumentId(), new StoredDocument(
                request.getDocumentId(),
                request.getContent(),
                request.getSource(),
                embedding
        ));
        log.info("Upserted RAG document: {} (vector dim={})", request.getDocumentId(), embedding.length);
    }

    @Override
    public List<RagSearchResult> search(String query, int topK) {
        double[] queryVec = embeddingService.embed(query);
        if (queryVec.length == 0) {
            return Collections.emptyList();
        }

        return store.values().stream()
                .map(doc -> {
                    double score = cosineSimilarity(queryVec, doc.embedding);
                    return RagSearchResult.builder()
                            .documentId(doc.id)
                            .content(doc.content)
                            .source(doc.source)
                            .score(score)
                            .build();
                })
                .filter(r -> r.getScore() >= similarityThreshold)
                .sorted(Comparator.comparingDouble(RagSearchResult::getScore).reversed())
                .limit(topK)
                .collect(Collectors.toList());
    }

    @Override
    public int documentCount() {
        return store.size();
    }

    private double cosineSimilarity(double[] a, double[] b) {
        if (a.length != b.length || a.length == 0) return 0.0;
        double dot = 0, normA = 0, normB = 0;
        for (int i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        double denom = Math.sqrt(normA) * Math.sqrt(normB);
        return denom == 0 ? 0.0 : dot / denom;
    }

    private record StoredDocument(String id, String content, String source, double[] embedding) {}
}
