package com.example.moduche.domain.myFit.service;

import com.example.moduche.domain.myFit.dto.prescription.MyFitPrescriptionResponseDTO;
import com.example.moduche.domain.myFit.entity.MyFitMeasure;

import java.util.List;

public interface MyFitPrescriptionService {
    void createPrescriptionFromMeasure(MyFitMeasure measure);
    List<MyFitPrescriptionResponseDTO> getPrescriptionsByUserId(Long userId);
}
