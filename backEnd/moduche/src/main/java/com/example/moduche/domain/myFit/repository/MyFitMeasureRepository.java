package com.example.moduche.domain.myFit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.moduche.domain.myFit.entity.MyFitMeasureResult;
import java.util.Optional;

public interface MyFitMeasureRepository extends JpaRepository<MyFitMeasureResult, Long> {
	
    Optional<MyFitMeasureResult> findByMeasureUserUserId(Long userId);
    
}
