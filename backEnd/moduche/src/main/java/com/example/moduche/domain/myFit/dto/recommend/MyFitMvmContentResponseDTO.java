package com.example.moduche.domain.myFit.dto.recommend;

import com.example.moduche.domain.myFit.entity.MyFitMvmContent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MyFitMvmContentResponseDTO {
    private String sportsStepNm;
    private String videoUrl;

    public static MyFitMvmContentResponseDTO fromEntity(MyFitMvmContent content) {
        return MyFitMvmContentResponseDTO.builder()
                .sportsStepNm(content.getSportsStepNm())
                .videoUrl(content.getVideoUrl())
                .build();
    }
}
