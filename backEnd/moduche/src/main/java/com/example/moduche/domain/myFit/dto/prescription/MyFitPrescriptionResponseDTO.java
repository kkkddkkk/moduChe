package com.example.moduche.domain.myFit.dto.prescription;

import com.example.moduche.domain.myFit.entity.MyFitPrescription;

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
public class MyFitPrescriptionResponseDTO {
	
	private Long prescriptionId;
    private String sexdstnFlagCd;
    private String troblTyNm;
    private String troblDetailNm;
    private String prescriptionContent;

    public static MyFitPrescriptionResponseDTO fromEntity(MyFitPrescription entity) {
    	return MyFitPrescriptionResponseDTO.builder()
    			.prescriptionId(entity.getPrescriptionId())
                .troblTyNm(entity.getTroblTyNm())
                .prescriptionContent(entity.getPrescriptionContent())
                .build();
//                .prescriptionId(entity.getPrescriptionId())
//                .sexdstnFlagCd(entity.getSexdstnFlagCd())
//                .troblTyNm(entity.getTroblTyNm())
//                .troblDetailNm(entity.getTroblDetailNm())
//                .prescriptionContent(entity.getPrescriptionContent())
//                .build();
    	
    }

}
