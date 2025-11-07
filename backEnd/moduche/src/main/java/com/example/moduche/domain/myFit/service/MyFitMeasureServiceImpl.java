package com.example.moduche.domain.myFit.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.moduche.domain.myFit.dto.measure.MyFitMeasureResponseDTO;
import com.example.moduche.domain.myFit.entity.MyFitMeasureResult;
import com.example.moduche.domain.myFit.repository.MyFitMeasureResultRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MyFitMeasureServiceImpl implements MyFitMeasureService {
	
	private final MyFitMeasureResultRepository measureResultRepository;

	@Override
    public List<MyFitMeasureResponseDTO> getAllMeasureResults() {
        return measureResultRepository.findAll().stream()
                .map(MyFitMeasureResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public MyFitMeasureResponseDTO getMeasureResultById(Long resultId) {
        MyFitMeasureResult result = measureResultRepository.findById(resultId)
                .orElseThrow(() -> new IllegalArgumentException("측정 결과를 찾을 수 없습니다."));
        return MyFitMeasureResponseDTO.fromEntity(result);
    }

}
