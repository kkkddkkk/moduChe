package com.example.moduche.domain.myFit.dto.measure;

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
    private String sex;
    private String age;
    private String disability;
    private double cardio;
    private double strength;
}
