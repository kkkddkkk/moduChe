package com.example.moduche.domain.myFit.service;

import java.util.List;

import com.example.moduche.domain.myFit.dto.recommend.MyFitMvmContentResponseDTO;
import com.example.moduche.domain.myFit.dto.recommend.MyFitRecommendResponseDTO;

public interface MyFitRecommendService {
	
	List<MyFitRecommendResponseDTO> getAllRecommends();
	
    MyFitRecommendResponseDTO getRecommendById(Long id);
    
    List<MyFitRecommendResponseDTO> getRecommendationsByDisability(String disabilityType);

    List<MyFitRecommendResponseDTO> getRecommendationsByCriteria(String agrdeFlagNm, String sexdstnFlagCd, String troblTyNm, String troblGradNm);

    List<MyFitMvmContentResponseDTO> getContentsByRecommendId(Long recommendId);

}
