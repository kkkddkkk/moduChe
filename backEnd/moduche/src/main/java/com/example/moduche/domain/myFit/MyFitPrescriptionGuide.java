package com.example.moduche.domain.myFit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "my_fit_prescription_guide")
@Getter @Setter @NoArgsConstructor
public class MyFitPrescriptionGuide extends MyFitBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long guideId;

    private String sexdstnFlagCd;    // 성별코드
    private String troblTyNm;        // 장애유형
    private String troblDetailNm;    // 장애상세명

    @Column(columnDefinition = "TEXT")
    private String prescriptionContent; // 운동처방내용
}
