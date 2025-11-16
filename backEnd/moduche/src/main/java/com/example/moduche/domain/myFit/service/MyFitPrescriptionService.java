package com.example.moduche.domain.myFit.service;

import java.util.List;

import com.example.moduche.domain.myFit.dto.prescription.MyFitPrescriptionRequestDTO;
import com.example.moduche.domain.myFit.dto.prescription.MyFitPrescriptionResponseDTO;

public interface MyFitPrescriptionService {
	
	List<MyFitPrescriptionResponseDTO> getAllPrescriptions();
	
    MyFitPrescriptionResponseDTO getPrescriptionById(Long id);

    MyFitPrescriptionResponseDTO generatePrescription(MyFitPrescriptionRequestDTO requestDTO);

}
