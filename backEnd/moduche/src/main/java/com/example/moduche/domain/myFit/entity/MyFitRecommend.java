package com.example.moduche.domain.myFit.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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
@Getter
@Setter
@NoArgsConstructor
public class MyFitRecommend extends MyFitBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recommendId;
    
    @Column(name = "TROBL_TY_NM")
    private String troblTyNm;

    @Column(name = "TROBL_GRAD_NM")
    private String troblGradNm;

    @Column(name = "SEXDSTN_FLAG_CD")
    private String sexdstnFlagCd;

    @Column(name = "AGRDE_FLAG_NM")
    private String agrdeFlagNm;

    @Column(name = "RECOMEND_MVM_NM")
    private String recommendMvmNm;
    
    @Column(name = "FLAG_ACCTO_RECOMEND_MVM_RANK_CO")
    private Integer rank;

    private String intensity;
    private String frequency;
    private String duration;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id")
    private MyFitPrescription prescription;

    @OneToMany(mappedBy = "recommend", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MyFitMvmContent> contents = new ArrayList<>();
}