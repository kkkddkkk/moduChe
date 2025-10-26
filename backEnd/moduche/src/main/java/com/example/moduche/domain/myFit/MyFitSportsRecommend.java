package com.example.moduche.domain.myFit;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "my_fit_sports_recommend")
@Getter @Setter @NoArgsConstructor
public class MyFitSportsRecommend extends MyFitBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recommendId;

    private String ageFlagNm;   // 연령대
    private String recommendMvmNm;  // 추천 운동명
    private Integer rank;       // 순위

    // 관계
    @OneToMany(mappedBy = "recommend", cascade = CascadeType.ALL)
    private List<MyFitMvmContent> contents = new ArrayList<>();
}