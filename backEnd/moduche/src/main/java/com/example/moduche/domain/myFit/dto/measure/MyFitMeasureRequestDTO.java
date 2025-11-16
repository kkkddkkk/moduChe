package com.example.moduche.domain.myFit.dto.measure;

import java.time.LocalDate;
import java.util.List;

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
public class MyFitMeasureRequestDTO {
	 private Long userId;

	    private String centerName;
	    private String measurePlaceFlagNm;
	    private Integer measureAge;
	    private String inputFlagNm;

	    private LocalDate measureDate;

	    private List<ResultDTO> results;

	    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
	    public static class ResultDTO {
	        private String itemName;
	        private Double score;
	        private String unit;
	        private String grade;
	    }
	}