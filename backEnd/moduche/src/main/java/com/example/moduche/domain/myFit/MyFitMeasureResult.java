package com.example.moduche.domain.myFit;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "my_fit_measure_result")
@Getter @Setter @NoArgsConstructor
public class MyFitMeasureResult extends MyFitBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resultId;

    private LocalDate measureDate;

    @Column(columnDefinition = "TEXT")
    private String prescriptionContent;
    
    private String itemName;
    private Double score;
    private String unit;
    private String grade; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "measure_id")
    private MyFitMeasure measure;
}
