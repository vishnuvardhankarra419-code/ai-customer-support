package com.aisupport.service;

import com.aisupport.repository.ChatMessageRepository;
import com.aisupport.repository.ChatSessionRepository;
import com.aisupport.repository.FeedbackRepository;
import com.aisupport.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UserRepository userRepository;
    private final ChatSessionRepository sessionRepository;
    private final ChatMessageRepository messageRepository;
    private final FeedbackRepository feedbackRepository;

    public Map<String, Object> getOverview() {
        Map<String, Object> overview = new LinkedHashMap<>();
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);

        overview.put("totalUsers", userRepository.count());
        overview.put("totalSessions", sessionRepository.count());
        overview.put("totalMessages", messageRepository.count());
        overview.put("messagesLast30Days", messageRepository.countMessagesSince(thirtyDaysAgo));
        overview.put("totalFeedback", feedbackRepository.count());

        Double avgRating = feedbackRepository.findAverageRating();
        overview.put("averageRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);

        return overview;
    }

    public List<Map<String, Object>> getMessageChart(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        List<Object[]> results = messageRepository.countMessagesByDay(since);

        List<Map<String, Object>> chartData = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("date", row[0].toString());
            point.put("count", row[1]);
            chartData.add(point);
        }
        return chartData;
    }

    public List<Map<String, Object>> getRatingDistribution() {
        List<Object[]> results = feedbackRepository.countByRating();
        List<Map<String, Object>> distribution = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("rating", row[0]);
            item.put("count", row[1]);
            distribution.add(item);
        }
        return distribution;
    }
}
