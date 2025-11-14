package com.example.moduche.domain.myFit.service;

import java.util.List;

import com.example.moduche.domain.myFit.dto.measure.MyFitMeasureRequestDTO;
import com.example.moduche.domain.myFit.dto.measure.MyFitMeasureResponseDTO;

public interface MyFitMeasureService {
	
	List<MyFitMeasureResponseDTO> getAllMeasureResults();
	
    MyFitMeasureResponseDTO getMeasureResultById(Long resultId);
    
    MyFitMeasureResponseDTO saveMeasure(MyFitMeasureRequestDTO dto);
    
}

