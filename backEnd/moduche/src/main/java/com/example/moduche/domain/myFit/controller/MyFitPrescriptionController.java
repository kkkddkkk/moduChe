package com.example.moduche.domain.myFit.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.moduche.domain.myFit.dto.prescription.MyFitPrescriptionResponseDTO;
import com.example.moduche.domain.myFit.service.MyFitPrescriptionService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/myfit/prescription")
@RequiredArgsConstructor
public class MyFitPrescriptionController {

    private final MyFitPrescriptionService prescriptionService;

    /** ���� �����͸� ������� � ó�� ���� */
    @GetMapping
    public ResponseEntity<List<MyFitPrescriptionResponseDTO>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MyFitPrescriptionResponseDTO> getPrescriptionById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionById(id));
    }
}
