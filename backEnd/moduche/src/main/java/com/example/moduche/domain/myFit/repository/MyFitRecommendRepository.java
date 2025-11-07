package com.example.moduche.domain.myFit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.moduche.domain.myFit.entity.MyFitRecommend;
import java.util.List;

public interface MyFitRecommendRepository extends JpaRepository<MyFitRecommend, Long> {
	
    List<MyFitRecommend> findByDisability(String disability);
    
}
