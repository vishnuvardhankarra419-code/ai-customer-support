package com.aisupport.repository;

import com.aisupport.model.Faq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FaqRepository extends JpaRepository<Faq, Long> {
    List<Faq> findByIsActiveTrueOrderByCreatedAtDesc();
    List<Faq> findByCategoryAndIsActiveTrue(String category);
    List<Faq> findByQuestionContainingIgnoreCaseAndIsActiveTrue(String keyword);
}
