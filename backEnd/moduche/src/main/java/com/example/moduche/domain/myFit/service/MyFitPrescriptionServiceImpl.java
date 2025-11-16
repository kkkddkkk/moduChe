package com.example.moduche.domain.myFit.service;

import com.example.moduche.domain.myFit.dto.prescription.MyFitPrescriptionRequestDTO;
import com.example.moduche.domain.myFit.dto.prescription.MyFitPrescriptionResponseDTO;
import com.example.moduche.domain.myFit.entity.MyFitPrescription;
import com.example.moduche.domain.myFit.repository.MyFitPrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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
                .orElseThrow(() -> new IllegalArgumentException("해당 처방을 찾을 수 없습니다."));
        return MyFitPrescriptionResponseDTO.fromEntity(prescription);
    }

    @Override
    @Transactional
    public MyFitPrescriptionResponseDTO generatePrescription(MyFitPrescriptionRequestDTO requestDTO) {
        MyFitPrescription prescription = new MyFitPrescription();
        prescription.setTroblTyNm(requestDTO.getDisability());
        // TODO: Implement business logic to generate prescription content based on requestDTO
        prescription.setPrescriptionContent(
            String.format("Generated prescription for disability '%s' with cardio=%.2f and strength=%.2f",
                requestDTO.getDisability(), requestDTO.getCardio(), requestDTO.getStrength())
        );

        MyFitPrescription savedPrescription = prescriptionRepository.save(prescription);
        return MyFitPrescriptionResponseDTO.fromEntity(savedPrescription);
    }
}