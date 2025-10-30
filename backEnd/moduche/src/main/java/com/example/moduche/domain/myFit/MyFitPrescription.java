package com.example.moduche.domain.myFit;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "my_fit_prescription")
@Getter @Setter @NoArgsConstructor
public class MyFitPrescription extends MyFitBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long prescriptionId;

    private String sexdstnFlagCd;
    private String troblTyNm;
    private String troblDetailNm;

    @Column(columnDefinition = "TEXT")
    private String prescriptionContent;
    
    @OneToOne
    @JoinColumn(name = "result_id")
    private MyFitMeasureResult measureResult;
    
    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MyFitRecommend> recommends = new ArrayList<>();
}
