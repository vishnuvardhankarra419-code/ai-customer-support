package com.aisupport.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FaqRequest {

    @NotBlank(message = "Question is required")
    @Size(max = 500)
    private String question;

    @NotBlank(message = "Answer is required")
    private String answer;

    @Size(max = 100)
    private String category = "General";

    private Boolean isActive = true;
}
