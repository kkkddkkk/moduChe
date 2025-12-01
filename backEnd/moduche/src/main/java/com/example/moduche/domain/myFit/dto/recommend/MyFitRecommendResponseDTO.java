package com.example.moduche.domain.myFit.dto.recommend;

import java.util.List;
import java.util.stream.Collectors;

import com.example.moduche.domain.myFit.entity.MyFitRecommend;

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
public class MyFitRecommendResponseDTO {
	
	private Long recommendId;
    private String agrdeFlagNm;
    private String sexdstnFlagCd;
    private String troblTyNm;
    private String troblGradNm;
    private String recommendMvmNm;
    private Integer rank;
    private String intensity;
    private String frequency;
    private String duration;
    private List<MyFitMvmContentResponseDTO> contents;

    public static MyFitRecommendResponseDTO fromEntity(MyFitRecommend entity) {
        List<MyFitMvmContentResponseDTO> contentDTOs = entity.getContents() == null ? null : entity.getContents().stream()
                .map(MyFitMvmContentResponseDTO::fromEntity)
                .collect(Collectors.toList());

    	return MyFitRecommendResponseDTO.builder()
                .recommendId(entity.getRecommendId())
                .agrdeFlagNm(entity.getAgrdeFlagNm())
                .sexdstnFlagCd(entity.getSexdstnFlagCd())
                .troblTyNm(entity.getTroblTyNm())
                .troblGradNm(entity.getTroblGradNm())
                .recommendMvmNm(entity.getRecommendMvmNm())
                .rank(entity.getRank())
                .intensity(entity.getIntensity())
                .frequency(entity.getFrequency())
                .duration(entity.getDuration())
                .contents(contentDTOs)
                .build();
        
    }
}
