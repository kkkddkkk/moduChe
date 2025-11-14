package com.example.moduche.domain.myFit.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.moduche.domain.login.User;
import com.example.moduche.domain.myFit.dto.measure.MyFitMeasureRequestDTO;
import com.example.moduche.domain.myFit.dto.measure.MyFitMeasureResponseDTO;
import com.example.moduche.domain.myFit.entity.MyFitMeasure;
import com.example.moduche.domain.myFit.entity.MyFitMeasureResult;
import com.example.moduche.domain.myFit.repository.MyFitMeasureRepository;
import com.example.moduche.domain.myFit.repository.MyFitMeasureResultRepository;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MyFitMeasureServiceImpl implements MyFitMeasureService {

    private final MyFitMeasureRepository measureRepository;
    private final MyFitMeasureResultRepository resultRepository;
    private final UserRepository userRepository;

    /** 저장 (POST) */
    @Override
    @Transactional
    public MyFitMeasureResponseDTO saveMeasure(MyFitMeasureRequestDTO dto) {

        User user = null;
        if (dto.getUserId() != null) {
            user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found: " + dto.getUserId()));
        }

        // 1) 측정 메타 저장
        MyFitMeasure measure = new MyFitMeasure();
        measure.setUser(user);
        measure.setCenterName(dto.getCenterName());
        measure.setMeasurePlaceFlagNm(dto.getMeasurePlaceFlagNm());
        measure.setMeasureAge(dto.getMeasureAge());
        measure.setInputFlagNm(dto.getInputFlagNm());
        measure.setMeasureDate(dto.getMeasureDate());

        // 2) 측정 결과 저장
        if (dto.getResults() != null) {
            dto.getResults().forEach(r -> {
                MyFitMeasureResult result = new MyFitMeasureResult();
                result.setItemName(r.getItemName());
                result.setScore(r.getScore());
                result.setUnit(r.getUnit());
                result.setGrade(r.getGrade());
                result.setMeasureDate(dto.getMeasureDate());
                result.setMeasure(measure);

                measure.getResults().add(result);
            });
        }
        MyFitMeasure savedMeasure = measureRepository.save(measure);

        return convertToResponse(savedMeasure);
    }

    /** 전체조회 (GET) */
    @Override
    @Transactional(readOnly = true)
    public List<MyFitMeasureResponseDTO> getAllMeasureResults() {
        return measureRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    /** 단건조회 (GET) */
    @Override
    @Transactional(readOnly = true)
    public MyFitMeasureResponseDTO getMeasureResultById(Long resultId) {

        MyFitMeasureResult result = resultRepository.findById(resultId)
                .orElseThrow(() -> new IllegalArgumentException("Result not found: " + resultId));

        MyFitMeasure measure = result.getMeasure();
        return convertToResponse(measure);
    }

    /** 공통 변환 메서드 */
    private MyFitMeasureResponseDTO convertToResponse(MyFitMeasure measure) {
        MyFitMeasureResponseDTO dto = new MyFitMeasureResponseDTO();

        dto.setMeasureId(measure.getMeasureId());
        dto.setUserId(measure.getUser() != null ? measure.getUser().getUserId() : null);
        dto.setCenterName(measure.getCenterName());
        dto.setMeasureDate(measure.getMeasureDate());

        dto.setResults(
                measure.getResults().stream()
                        .map(r -> {
                            MyFitMeasureResponseDTO.ResultDTO rd = new MyFitMeasureResponseDTO.ResultDTO();
                            rd.setResultId(r.getResultId());
                            rd.setItemName(r.getItemName());
                            rd.setScore(r.getScore());
                            rd.setUnit(r.getUnit());
                            rd.setGrade(r.getGrade());
                            return rd;
                        })
                        .collect(Collectors.toList())
        );

        return dto;
    }
}
