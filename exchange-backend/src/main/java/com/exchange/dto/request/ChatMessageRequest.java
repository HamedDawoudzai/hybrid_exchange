package com.exchange.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequest {

    @Pattern(regexp = "user|assistant|system", message = "Role must be user, assistant, or system")
    private String role;

    @NotBlank(message = "Content is required")
    private String content;
}
