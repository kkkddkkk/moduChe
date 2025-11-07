package com.example.moduche.domain.myFit.dto.measure;

import java.time.LocalDate;

import com.example.moduche.domain.myFit.entity.MyFitMeasureResult;

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
public class MyFitMeasureResponseDTO {
	
	private Long resultId;
    private LocalDate measureDate;
    private String itemName;
    private Double score;
    private String unit;
    private String grade;
    private String prescriptionContent;
    
    public static MyFitMeasureResponseDTO fromEntity(MyFitMeasureResult entity) {
        return MyFitMeasureResponseDTO.builder()
        		.resultId(entity.getResultId())
                .measureDate(entity.getMeasureDate())
                .itemName(entity.getItemName())
                .score(entity.getScore())
                .unit(entity.getUnit())
                .grade(entity.getGrade())
                .prescriptionContent(entity.getPrescriptionContent())
                .build();
    }
}
