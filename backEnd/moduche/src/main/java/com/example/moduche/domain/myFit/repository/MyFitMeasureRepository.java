package com.example.moduche.domain.myFit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.moduche.domain.myFit.entity.MyFitMeasure;

public interface MyFitMeasureRepository extends JpaRepository<MyFitMeasure, Long> {
	
    
}
