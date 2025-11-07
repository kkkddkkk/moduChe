package com.example.moduche.domain.myFit.service;

import java.util.List;

import com.example.moduche.domain.myFit.dto.prescription.MyFitPrescriptionResponseDTO;

public interface MyFitPrescriptionService {
	
	List<MyFitPrescriptionResponseDTO> getAllPrescriptions();
	
    MyFitPrescriptionResponseDTO getPrescriptionById(Long id);

}
