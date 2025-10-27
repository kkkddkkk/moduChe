package com.example.moduche.domain.myFit;

import java.time.LocalDate;

import com.example.moduche.domain.login.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "my_fit_member_measure")
@Getter @Setter @NoArgsConstructor
public class MyFitMeasure extends MyFitBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long measureId;

    private String centerName;
    private String measurePlaceFlagNm;
    private Integer measureAge;
    private String inputFlagNm;
    private LocalDate measureDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne(mappedBy = "measure", cascade = CascadeType.ALL)
    private MyFitMeasureResult result;
}






