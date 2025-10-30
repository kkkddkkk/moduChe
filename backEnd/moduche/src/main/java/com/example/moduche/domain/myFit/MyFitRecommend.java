package com.example.moduche.domain.myFit;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "my_fit_recommend")
@Getter @Setter @NoArgsConstructor
public class MyFitRecommend extends MyFitBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recommendId;

    private String ageFlagNm;
    private String recommendMvmNm;
    private Integer rank;
    private String intensity;
    private String frequency;
    private String duration;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id")
    private MyFitPrescription prescription;

    @OneToMany(mappedBy = "recommend", cascade = CascadeType.ALL)
    private List<MyFitMvmContent> contents = new ArrayList<>();
}