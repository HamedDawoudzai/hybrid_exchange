package com.exchange.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RagSearchRequest {

    @NotBlank(message = "Query is required")
    private String query;

    private Integer topK;
}
