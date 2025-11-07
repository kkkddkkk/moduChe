package com.example.moduche.domain.myFit.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.moduche.domain.myFit.dto.prescription.MyFitPrescriptionResponseDTO;
import com.example.moduche.domain.myFit.entity.MyFitPrescription;
import com.example.moduche.domain.myFit.repository.MyFitPrescriptionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyFitPrescriptionServiceImpl implements MyFitPrescriptionService {
	
	private final MyFitPrescriptionRepository prescriptionRepository;

    @Override
    public List<MyFitPrescriptionResponseDTO> getAllPrescriptions() {
        return prescriptionRepository.findAll().stream()
                .map(MyFitPrescriptionResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public MyFitPrescriptionResponseDTO getPrescriptionById(Long id) {
        MyFitPrescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("처방 정보를 찾을 수 없습니다."));
        return MyFitPrescriptionResponseDTO.fromEntity(prescription);
    }
}
