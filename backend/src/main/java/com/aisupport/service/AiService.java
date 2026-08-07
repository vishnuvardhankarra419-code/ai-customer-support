package com.aisupport.service;

import com.aisupport.model.ChatMessage;
import com.aisupport.model.Faq;
import com.aisupport.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final ChatClient.Builder chatClientBuilder;
    private final FaqRepository faqRepository;

    private static final String SYSTEM_PROMPT = """
            You are a helpful and friendly AI customer support assistant.
            Your goal is to assist customers with their questions and issues professionally.
            Be concise, clear, and empathetic in your responses.
            If you don't know something, say so honestly and offer to escalate to a human agent.
            Always maintain a positive and professional tone.
            """;

    public String generateResponse(String userMessage, List<ChatMessage> conversationHistory) {
        try {
            // Try OpenAI first
            return callOpenAi(userMessage, conversationHistory);
        } catch (Exception e) {
            log.warn("OpenAI call failed, falling back to FAQ matching: {}", e.getMessage());
            return fallbackFaqResponse(userMessage);
        }
    }

    private String callOpenAi(String userMessage, List<ChatMessage> history) {
        List<Message> messages = new ArrayList<>();
        messages.add(new SystemMessage(SYSTEM_PROMPT));

        // Add conversation history (last 10 messages for context)
        int start = Math.max(0, history.size() - 10);
        for (int i = start; i < history.size(); i++) {
            ChatMessage msg = history.get(i);
            if (msg.getSender() == ChatMessage.SenderType.USER) {
                messages.add(new UserMessage(msg.getContent()));
            } else {
                messages.add(new AssistantMessage(msg.getContent()));
            }
        }

        messages.add(new UserMessage(userMessage));

        ChatClient chatClient = chatClientBuilder.build();
        return chatClient.prompt()
                .messages(messages)
                .call()
                .content();
    }

    private String fallbackFaqResponse(String userMessage) {
        String lowerMessage = userMessage.toLowerCase();
        List<Faq> faqs = faqRepository.findByIsActiveTrueOrderByCreatedAtDesc();

        // Simple keyword matching
        for (Faq faq : faqs) {
            String[] keywords = faq.getQuestion().toLowerCase().split("\\s+");
            long matchCount = 0;
            for (String keyword : keywords) {
                if (keyword.length() > 3 && lowerMessage.contains(keyword)) {
                    matchCount++;
                }
            }
            if (matchCount >= 2) {
                return faq.getAnswer();
            }
        }

        return "Thank you for reaching out! I'm here to help. Could you please provide more details about your issue? " +
               "If you need immediate assistance, you can also email us at support@aisupport.com.";
    }
}
