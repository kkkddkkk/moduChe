package com.example.moduche.domain.myFit.controller;

import com.example.moduche.domain.myFit.dto.measure.MyFitMeasureResponseDTO;
import com.example.moduche.domain.myFit.service.MyFitMeasureService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/myfit/measure")
@RequiredArgsConstructor
public class MyFitMeasureController {

    private final MyFitMeasureService measureService;

    /** 측정 데이터 저장 */
    @GetMapping
    public ResponseEntity<List<MyFitMeasureResponseDTO>> getAllMeasures() {
        return ResponseEntity.ok(measureService.getAllMeasureResults());
    }

    /** 특정 사용자 측정 결과 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<MyFitMeasureResponseDTO> getMeasureById(@PathVariable Long id) {
        return ResponseEntity.ok(measureService.getMeasureResultById(id));
    }
}
