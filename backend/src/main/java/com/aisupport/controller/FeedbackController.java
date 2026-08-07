package com.aisupport.controller;

import com.aisupport.dto.request.FeedbackRequest;
import com.aisupport.model.Feedback;
import com.aisupport.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
@Tag(name = "Feedback", description = "Customer feedback APIs")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    @Operation(summary = "Submit feedback (authenticated users)")
    public ResponseEntity<Feedback> submitFeedback(
            @Valid @RequestBody FeedbackRequest request) {
        return ResponseEntity.ok(feedbackService.submitFeedback(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all feedback (admin only)")
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }

    @GetMapping("/average-rating")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get average satisfaction rating (admin only)")
    public ResponseEntity<Double> getAverageRating() {
        return ResponseEntity.ok(feedbackService.getAverageRating());
    }
}
