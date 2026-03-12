package com.exchange.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RagDocumentRequest {

    @NotBlank(message = "Document ID is required")
    private String documentId;

    @NotBlank(message = "Content is required")
    private String content;

    private String source;
}
