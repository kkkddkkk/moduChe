package com.example.moduche.domain.myFit.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import Transactional
import org.springframework.util.StringUtils; // Import StringUtils

import com.example.moduche.domain.myFit.dto.recommend.MyFitMvmContentResponseDTO;
import com.example.moduche.domain.myFit.dto.recommend.MyFitRecommendResponseDTO;
import com.example.moduche.domain.myFit.entity.MyFitMvmContent;
import com.example.moduche.domain.myFit.entity.MyFitRecommend;
import com.example.moduche.domain.myFit.repository.MyFitMvmContentRepository;
import com.example.moduche.domain.myFit.repository.MyFitRecommendRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional // Ensure the service methods are transactional
public class MyFitRecommendServiceImpl implements MyFitRecommendService {
	
	private final MyFitRecommendRepository recommendRepository;
	private final MyFitMvmContentRepository myFitMvmContentRepository;
    private static final Logger logger = LoggerFactory.getLogger(MyFitRecommendServiceImpl.class);

    @Override
    @Transactional(readOnly = true) // Add readOnly for read operations
    public List<MyFitRecommendResponseDTO> getAllRecommends() {
        return recommendRepository.findAll().stream()
                .map(MyFitRecommendResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true) // Add readOnly for read operations
    public MyFitRecommendResponseDTO getRecommendById(Long id) {
        MyFitRecommend recommend = recommendRepository.findByIdWithContents(id) // Use findByIdWithContents
                .orElseThrow(() -> new IllegalArgumentException("추천 운동을 찾을 수 없습니다."));
        return MyFitRecommendResponseDTO.fromEntity(recommend);
    }

    @Override
    @Transactional(readOnly = true) // Add readOnly for read operations
    public List<MyFitRecommendResponseDTO> getRecommendationsByDisability(String troblTyNm) {
        return recommendRepository.findByTroblTyNm(troblTyNm).stream()
                .map(MyFitRecommendResponseDTO::fromEntity)
                .collect(Collectors.toList());
	}

    @Override
    @Transactional(readOnly = true) // Add readOnly for read operations
    public List<MyFitRecommendResponseDTO> getRecommendationsByCriteria(String agrdeFlagNm, String sexdstnFlagCd, String troblTyNm, String troblGradNm) {
        // Preprocess empty strings to null for optional parameters
        String processedAgrdeFlagNm = StringUtils.hasText(agrdeFlagNm) ? agrdeFlagNm.trim() : null;
        String processedSexdstnFlagCd = StringUtils.hasText(sexdstnFlagCd) ? sexdstnFlagCd.trim() : null;
        String processedTroblTyNm = StringUtils.hasText(troblTyNm) ? troblTyNm.trim() : null;
        String processedTroblGradNm = StringUtils.hasText(troblGradNm) ? troblGradNm.trim() : null;

        logger.info("Searching recommendations with criteria: age={}, gender={}, disabilityType={}, disabilityGrade={}", 
            processedAgrdeFlagNm, processedSexdstnFlagCd, processedTroblTyNm, processedTroblGradNm);
        
        List<MyFitRecommend> results = recommendRepository.findByCriteria(
            processedAgrdeFlagNm, processedSexdstnFlagCd, processedTroblTyNm, processedTroblGradNm
        );

        logger.info("Found {} recommendations.", results.size());

        return results.stream()
         .map(MyFitRecommendResponseDTO::fromEntity)
         .collect(Collectors.toList());
    }

	@Override
	public List<MyFitMvmContentResponseDTO> getContentsByRecommendId(Long recommendId) {
		List<MyFitMvmContent> contents = myFitMvmContentRepository.findByRecommendRecommendIdOrderByStepOrderAsc(recommendId);
        return contents.stream()
                .map(MyFitMvmContentResponseDTO::fromEntity)
                .collect(Collectors.toList());
	}
}
