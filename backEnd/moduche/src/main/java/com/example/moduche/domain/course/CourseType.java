package com.example.moduche.domain.course;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "coursetype")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CourseType {
    @Id
    @Column(name = "type_code", nullable = false)
    private String typeCode;
    @Column(name = "type_name", nullable = true)
    private String typeName;
}