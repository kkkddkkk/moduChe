package com.example.moduche.domain.myFit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.myFit.entity.MyFitRecommend;
import java.util.List;
import java.util.Optional;

public interface MyFitRecommendRepository extends JpaRepository<MyFitRecommend, Long> {
	
	List<MyFitRecommend> findByDisabilityType(String disabilityType);

    @Query("SELECT r FROM MyFitRecommend r LEFT JOIN FETCH r.contents WHERE r.id = :id")
    Optional<MyFitRecommend> findByIdWithContents(@Param("id") Long id);
    
}
