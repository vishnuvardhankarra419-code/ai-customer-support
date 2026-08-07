package com.aisupport.service;

import com.aisupport.dto.request.FaqRequest;
import com.aisupport.model.Faq;
import com.aisupport.model.User;
import com.aisupport.repository.FaqRepository;
import com.aisupport.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FaqService {

    private final FaqRepository faqRepository;

    public List<Faq> getAllActiveFaqs() {
        return faqRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    public List<Faq> getAllFaqs() {
        return faqRepository.findAll();
    }

    @Transactional
    public Faq createFaq(FaqRequest request) {
        User currentUser = getCurrentUser();
        Faq faq = Faq.builder()
                .question(request.getQuestion())
                .answer(request.getAnswer())
                .category(request.getCategory())
                .isActive(request.getIsActive())
                .createdBy(currentUser)
                .build();
        return faqRepository.save(faq);
    }

    @Transactional
    public Faq updateFaq(Long id, FaqRequest request) {
        Faq faq = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found with id: " + id));
        faq.setQuestion(request.getQuestion());
        faq.setAnswer(request.getAnswer());
        faq.setCategory(request.getCategory());
        faq.setIsActive(request.getIsActive());
        return faqRepository.save(faq);
    }

    @Transactional
    public void deleteFaq(Long id) {
        if (!faqRepository.existsById(id)) {
            throw new RuntimeException("FAQ not found with id: " + id);
        }
        faqRepository.deleteById(id);
    }

    private User getCurrentUser() {
        CustomUserDetails details = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return details.getUser();
    }
}
