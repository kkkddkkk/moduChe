package com.example.moduche.domain.myFit.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.moduche.domain.myFit.dto.recommend.MyFitRecommendResponseDTO;
import com.example.moduche.domain.myFit.entity.MyFitRecommend;
import com.example.moduche.domain.myFit.repository.MyFitRecommendRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyFitRecommendServiceImpl implements MyFitRecommendService {
	
	private final MyFitRecommendRepository recommendRepository;

    @Override
    public List<MyFitRecommendResponseDTO> getAllRecommends() {
        return recommendRepository.findAll().stream()
                .map(MyFitRecommendResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public MyFitRecommendResponseDTO getRecommendById(Long id) {
        MyFitRecommend recommend = recommendRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("추천 정보를 찾을 수 없습니다."));
        return MyFitRecommendResponseDTO.fromEntity(recommend);
    }

    @Override
    public List<MyFitRecommendResponseDTO> getRecommendationsByDisability(String disabilityType) {
        return recommendRepository.findByDisabilityType(disabilityType).stream()
                .map(MyFitRecommendResponseDTO::fromEntity)
                .collect(Collectors.toList());
	}
}
