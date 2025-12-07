package com.example.moduche.domain.myFit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.moduche.domain.myFit.entity.MyFitMvmContent;
import java.util.List;

public interface MyFitMvmContentRepository extends JpaRepository<MyFitMvmContent, Long> {
    List<MyFitMvmContent> findByRecommendRecommendIdOrderByStepOrderAsc(Long recommendId);
}
