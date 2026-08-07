package com.aisupport.controller;

import com.aisupport.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Analytics", description = "Platform analytics APIs (Admin only)")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/overview")
    @Operation(summary = "Get platform-wide analytics overview")
    public ResponseEntity<Map<String, Object>> getOverview() {
        return ResponseEntity.ok(analyticsService.getOverview());
    }

    @GetMapping("/messages/chart")
    @Operation(summary = "Get daily message counts for chart (default last 30 days)")
    public ResponseEntity<List<Map<String, Object>>> getMessageChart(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(analyticsService.getMessageChart(days));
    }

    @GetMapping("/feedback/distribution")
    @Operation(summary = "Get feedback rating distribution")
    public ResponseEntity<List<Map<String, Object>>> getRatingDistribution() {
        return ResponseEntity.ok(analyticsService.getRatingDistribution());
    }
}
