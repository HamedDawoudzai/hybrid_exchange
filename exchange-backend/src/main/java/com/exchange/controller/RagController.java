package com.exchange.controller;

import com.exchange.dto.request.RagDocumentRequest;
import com.exchange.dto.request.RagSearchRequest;
import com.exchange.dto.response.ApiResponse;
import com.exchange.dto.response.RagSearchResult;
import com.exchange.service.RagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rag")
@RequiredArgsConstructor
public class RagController {

    private final RagService ragService;

    @PostMapping("/documents")
    public ResponseEntity<ApiResponse<Map<String, Object>>> upsertDocument(
            @Valid @RequestBody RagDocumentRequest request) {
        ragService.upsertDocument(request);
        return ResponseEntity.ok(ApiResponse.success("Document indexed",
                Map.of("documentId", request.getDocumentId(), "totalDocuments", ragService.documentCount())));
    }

    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<RagSearchResult>>> search(
            @Valid @RequestBody RagSearchRequest request) {
        int topK = request.getTopK() != null ? request.getTopK() : 3;
        List<RagSearchResult> results = ragService.search(request.getQuery(), topK);
        return ResponseEntity.ok(ApiResponse.success("OK", results));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> stats() {
        return ResponseEntity.ok(ApiResponse.success("OK",
                Map.of("totalDocuments", ragService.documentCount())));
    }
}
