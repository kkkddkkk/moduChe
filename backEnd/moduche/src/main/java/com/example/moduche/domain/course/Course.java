package com.example.moduche.domain.course;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "course")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Course {
    @Column(name = "type_code", nullable = false)
    private String typeCode;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id", nullable = false)
    private Long courseId;
    @Column(name = "title", nullable = true)
    private String title;
    @Column(name = "description", nullable = true)
    private String description;
    @Column(name = "max_participants", nullable = true)
    private Integer maxParticipants;
    @Column(name = "format", nullable = true)
    private String format;
    @Column(name = "accommodation_offered", nullable = true)
    private String accommodationOffered;
    @Column(name = "disability_type", nullable = true)
    private String disabilityType;
    @Column(name = "user_id", nullable = true)
    private Long userId;
    @Column(name = "facility_id", nullable = false)
    private Long facilityId;
    @Column(name = "curse_status", nullable = true)
    private String curseStatus;
    @Column(name = "course_status", nullable = true)
    private String courseStatus;
    @Column(name = "guardian_required", nullable = true)
    private String guardianRequired;
}