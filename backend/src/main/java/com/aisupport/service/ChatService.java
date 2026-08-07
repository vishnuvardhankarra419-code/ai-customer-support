package com.aisupport.service;

import com.aisupport.dto.request.ChatRequest;
import com.aisupport.dto.response.ChatMessageResponse;
import com.aisupport.dto.response.ChatSessionResponse;
import com.aisupport.model.ChatMessage;
import com.aisupport.model.ChatSession;
import com.aisupport.model.User;
import com.aisupport.repository.ChatMessageRepository;
import com.aisupport.repository.ChatSessionRepository;
import com.aisupport.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatSessionRepository sessionRepository;
    private final ChatMessageRepository messageRepository;
    private final AiService aiService;

    @Transactional
    public ChatMessageResponse sendMessage(ChatRequest request) {
        User currentUser = getCurrentUser();

        // Get or create chat session
        ChatSession session;
        if (request.getSessionId() != null) {
            session = sessionRepository.findById(request.getSessionId())
                    .orElseGet(() -> createNewSession(currentUser, request.getMessage()));
        } else {
            session = createNewSession(currentUser, request.getMessage());
        }

        // Save user message
        ChatMessage userMessage = ChatMessage.builder()
                .session(session)
                .sender(ChatMessage.SenderType.USER)
                .content(request.getMessage())
                .build();
        messageRepository.save(userMessage);

        // Get conversation history for context
        List<ChatMessage> history = messageRepository
                .findBySessionIdOrderByTimestampAsc(session.getId());

        // Generate AI response
        String aiContent = aiService.generateResponse(request.getMessage(), history);

        // Save AI message
        ChatMessage aiMessage = ChatMessage.builder()
                .session(session)
                .sender(ChatMessage.SenderType.AI)
                .content(aiContent)
                .build();
        messageRepository.save(aiMessage);

        return mapToResponse(aiMessage);
    }

    public List<ChatSessionResponse> getUserSessions() {
        User currentUser = getCurrentUser();
        return sessionRepository.findByUserIdOrderByUpdatedAtDesc(currentUser.getId())
                .stream()
                .map(this::mapSessionToResponse)
                .collect(Collectors.toList());
    }

    public List<ChatMessageResponse> getSessionMessages(Long sessionId) {
        return messageRepository.findBySessionIdOrderByTimestampAsc(sessionId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ChatSession createNewSession(User user, String firstMessage) {
        String title = firstMessage.length() > 50
                ? firstMessage.substring(0, 47) + "..."
                : firstMessage;

        ChatSession session = ChatSession.builder()
                .user(user)
                .title(title)
                .status(ChatSession.SessionStatus.ACTIVE)
                .build();
        return sessionRepository.save(session);
    }

    private User getCurrentUser() {
        CustomUserDetails details = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return details.getUser();
    }

    private ChatMessageResponse mapToResponse(ChatMessage message) {
        return ChatMessageResponse.builder()
                .id(message.getId())
                .sessionId(message.getSession().getId())
                .sender(message.getSender().name())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .build();
    }

    private ChatSessionResponse mapSessionToResponse(ChatSession session) {
        return ChatSessionResponse.builder()
                .id(session.getId())
                .title(session.getTitle())
                .status(session.getStatus().name())
                .createdAt(session.getCreatedAt())
                .updatedAt(session.getUpdatedAt())
                .messageCount(session.getMessages() != null ? session.getMessages().size() : 0)
                .build();
    }
}
