package com.example.moduche.domain.login;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "accessibilityprofile")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class AccessibilityProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id2", nullable = true)
    private Long userId2;
    @Column(name = "acc_id", nullable = false)
    private Long accId;
    @Column(name = "disablity_grade", nullable = true)
    private String disablityGrade;
    @Column(name = "disability_type", nullable = true)
    private String disabilityType;
    @Column(name = "vision_support", nullable = true)
    private String visionSupport;
    @Column(name = "hearing_support", nullable = true)
    private String hearingSupport;
    @Column(name = "note", nullable = true)
    private String note;
    @Column(name = "user_id", nullable = true)
    private Long userId;
}