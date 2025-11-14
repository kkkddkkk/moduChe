package com.example.moduche.domain.myFit.dto.measure;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class MyFitMeasureResponseDTO {

	private Long measureId;
    private Long userId;
    private String centerName;
    private LocalDate measureDate;
    private List<ResultDTO> results;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResultDTO {
        private Long resultId;
        private String itemName;
        private Double score;
        private String unit;
        private String grade;
    }
}