package com.aisupport.controller;

import com.aisupport.dto.request.FaqRequest;
import com.aisupport.model.Faq;
import com.aisupport.service.FaqService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faq")
@RequiredArgsConstructor
@Tag(name = "FAQ", description = "FAQ management APIs")
public class FaqController {

    private final FaqService faqService;

    @GetMapping
    @Operation(summary = "Get all active FAQs (public)")
    public ResponseEntity<List<Faq>> getActiveFaqs() {
        return ResponseEntity.ok(faqService.getAllActiveFaqs());
    }

    @GetMapping("/all")
    @Operation(summary = "Get all FAQs including inactive (admin)")
    public ResponseEntity<List<Faq>> getAllFaqs() {
        return ResponseEntity.ok(faqService.getAllFaqs());
    }

    @PostMapping
    @Operation(summary = "Create a new FAQ (admin only)")
    public ResponseEntity<Faq> createFaq(@Valid @RequestBody FaqRequest request) {
        return ResponseEntity.ok(faqService.createFaq(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing FAQ (admin only)")
    public ResponseEntity<Faq> updateFaq(@PathVariable Long id,
                                          @Valid @RequestBody FaqRequest request) {
        return ResponseEntity.ok(faqService.updateFaq(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a FAQ (admin only)")
    public ResponseEntity<Void> deleteFaq(@PathVariable Long id) {
        faqService.deleteFaq(id);
        return ResponseEntity.noContent().build();
    }
}
