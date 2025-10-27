package com.example.moduche.domain.myFit;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "my_fit_member_measure")
@Getter @Setter @NoArgsConstructor
public class MyFitMeasureResult extends MyFitBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resultId;

    private LocalDate measureDate;

    @Column(columnDefinition = "TEXT")
    private String prescriptionContent; // MVM_PRSCRPTN_CN

    // FK
    @OneToOne
    @JoinColumn(name = "measure_id")
    private MyFitMeasure measure;
}
