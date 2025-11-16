package com.example.moduche.domain.myFit.controller;

import com.example.moduche.domain.myFit.dto.measure.MyFitMeasureRequestDTO;
import com.example.moduche.domain.myFit.dto.measure.MyFitMeasureResponseDTO;
import com.example.moduche.domain.myFit.service.MyFitMeasureService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/myfit/measure")
@RequiredArgsConstructor
public class MyFitMeasureController {

    private final MyFitMeasureService measureService;

    /** ✅ 전체 추천 운동 조회 */
    @GetMapping
    public ResponseEntity<List<MyFitMeasureResponseDTO>> getAllMeasures() {
        return ResponseEntity.ok(measureService.getAllMeasureResults());
    }

    /** ✅ ID 기준 추천 운동 상세 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<MyFitMeasureResponseDTO> getMeasureById(@PathVariable Long id) {
        return ResponseEntity.ok(measureService.getMeasureResultById(id));
    }
    
    @PostMapping
    public ResponseEntity<MyFitMeasureResponseDTO> saveMeasure(
            @RequestBody MyFitMeasureRequestDTO dto) {
        return ResponseEntity.ok(measureService.saveMeasure(dto));
    }
}
