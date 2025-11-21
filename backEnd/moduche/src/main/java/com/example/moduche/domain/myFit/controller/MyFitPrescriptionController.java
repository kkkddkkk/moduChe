package com.example.moduche.domain.myFit.controller;

import com.example.moduche.domain.myFit.dto.prescription.MyFitPrescriptionResponseDTO;
import com.example.moduche.domain.myFit.entity.MyFitMeasure;
import com.example.moduche.domain.myFit.repository.MyFitMeasureRepository;
import com.example.moduche.domain.myFit.service.MyFitPrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/myfit/prescription")
@RequiredArgsConstructor
public class MyFitPrescriptionController {

    private final MyFitPrescriptionService prescriptionService;
    private final MyFitMeasureRepository myFitMeasureRepository;

    /**
     * 측정 ID를 기반으로 처방을 생성합니다.
     * @param measureId 측정 ID
     * @return 생성된 처방 정보 또는 에러 응답
     */
    @PostMapping("/from-measure/{measureId}")
    public ResponseEntity<Void> createPrescriptionFromMeasure(@PathVariable("measureId") Long measureId) {
        MyFitMeasure measure = myFitMeasureRepository.findById(measureId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Measure not found with id: " + measureId));

        prescriptionService.createPrescriptionFromMeasure(measure);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * 사용자 ID를 기반으로 모든 처방을 조회합니다.
     * @param userId 사용자 ID
     * @return 해당 사용자의 모든 처방 목록
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<MyFitPrescriptionResponseDTO>> getPrescriptionsByUserId(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByUserId(userId));
    }
}