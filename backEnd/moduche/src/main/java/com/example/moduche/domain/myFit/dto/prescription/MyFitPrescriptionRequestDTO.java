package com.example.moduche.domain.myFit.dto.prescription;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyFitPrescriptionRequestDTO {
	
	private Long userId;
    private String disability;
    private double cardio;
    private double strength;

}
