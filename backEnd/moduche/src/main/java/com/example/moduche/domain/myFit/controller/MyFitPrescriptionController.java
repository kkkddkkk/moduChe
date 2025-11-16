package com.example.moduche.domain.myFit.controller;

import com.example.moduche.domain.myFit.dto.prescription.MyFitPrescriptionRequestDTO;
import com.example.moduche.domain.myFit.dto.prescription.MyFitPrescriptionResponseDTO;
import com.example.moduche.domain.myFit.service.MyFitPrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/myfit/prescription")
@RequiredArgsConstructor
public class MyFitPrescriptionController {

    private final MyFitPrescriptionService prescriptionService;

    /** 전체 처방 조회 */
    @GetMapping
    public ResponseEntity<List<MyFitPrescriptionResponseDTO>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions());
    }

    /** ID 기준 처방 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<MyFitPrescriptionResponseDTO> getPrescriptionById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionById(id));
    }

    /** 처방 생성 */
    @PostMapping
    public ResponseEntity<MyFitPrescriptionResponseDTO> generatePrescription(@RequestBody MyFitPrescriptionRequestDTO requestDTO) {
        return ResponseEntity.ok(prescriptionService.generatePrescription(requestDTO));
    }
}