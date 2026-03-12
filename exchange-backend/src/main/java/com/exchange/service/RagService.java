package com.exchange.service;

import com.exchange.dto.request.RagDocumentRequest;
import com.exchange.dto.response.RagSearchResult;

import java.util.List;

public interface RagService {

    void upsertDocument(RagDocumentRequest request);

    List<RagSearchResult> search(String query, int topK);

    int documentCount();
}
