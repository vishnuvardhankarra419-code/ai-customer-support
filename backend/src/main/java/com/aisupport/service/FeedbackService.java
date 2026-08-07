package com.aisupport.service;

import com.aisupport.dto.request.FeedbackRequest;
import com.aisupport.model.ChatSession;
import com.aisupport.model.Feedback;
import com.aisupport.model.User;
import com.aisupport.repository.ChatSessionRepository;
import com.aisupport.repository.FeedbackRepository;
import com.aisupport.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ChatSessionRepository sessionRepository;

    @Transactional
    public Feedback submitFeedback(FeedbackRequest request) {
        User currentUser = getCurrentUser();
        ChatSession session = null;

        if (request.getSessionId() != null) {
            session = sessionRepository.findById(request.getSessionId()).orElse(null);
        }

        Feedback feedback = Feedback.builder()
                .user(currentUser)
                .session(session)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc();
    }

    public Double getAverageRating() {
        return feedbackRepository.findAverageRating();
    }

    private User getCurrentUser() {
        CustomUserDetails details = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return details.getUser();
    }
}
