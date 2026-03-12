package com.exchange.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RagSearchResult {

    private String documentId;
    private String content;
    private String source;
    private double score;
}
