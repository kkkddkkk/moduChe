package com.example.moduche.domain.myFit.service;

import java.util.List;

import com.example.moduche.domain.myFit.dto.recommend.MyFitRecommendResponseDTO;

public interface MyFitRecommendService {
	
	List<MyFitRecommendResponseDTO> getAllRecommends();
	
    MyFitRecommendResponseDTO getRecommendById(Long id);

}
