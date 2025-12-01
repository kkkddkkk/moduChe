package com.example.moduche.domain.myFit.controller;

import com.example.moduche.domain.myFit.dto.recommend.MyFitRecommendResponseDTO;
import com.example.moduche.domain.myFit.service.MyFitRecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/myfit/recommend")
@RequiredArgsConstructor
public class MyFitRecommendController {

    private final MyFitRecommendService recommendService;

    @GetMapping
    
    public ResponseEntity<List<MyFitRecommendResponseDTO>> getAllRecommends() {
        return ResponseEntity.ok(recommendService.getAllRecommends());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MyFitRecommendResponseDTO> getRecommendById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(recommendService.getRecommendById(id));
    }

    @GetMapping("/disability")
    public ResponseEntity<List<MyFitRecommendResponseDTO>> getRecommendationsByDisability(
            @RequestParam("disability") String troblTyNm) {
        return ResponseEntity.ok(recommendService.getRecommendationsByDisability(troblTyNm));
    }

    @GetMapping("/search")
    public ResponseEntity<List<MyFitRecommendResponseDTO>> getRecommendationsByCriteria(
            @RequestParam(value = "age", required = false) String agrdeFlagNm,
            @RequestParam(value = "gender", required = false) String sexdstnFlagCd,
            @RequestParam(value = "disabilityType", required = false) String troblTyNm,
            @RequestParam(value = "disabilityGrade", required = false) String troblGradNm) {
        return ResponseEntity.ok(recommendService.getRecommendationsByCriteria(agrdeFlagNm, sexdstnFlagCd, troblTyNm, troblGradNm));
    }
}
