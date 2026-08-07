package com.aisupport.repository;

import com.aisupport.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySessionIdOrderByTimestampAsc(Long sessionId);
    long countBySessionId(Long sessionId);

    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.timestamp >= :since")
    long countMessagesSince(LocalDateTime since);

    @Query("SELECT DATE(m.timestamp) as date, COUNT(m) as count " +
           "FROM ChatMessage m WHERE m.timestamp >= :since " +
           "GROUP BY DATE(m.timestamp) ORDER BY DATE(m.timestamp)")
    List<Object[]> countMessagesByDay(LocalDateTime since);
}
