package com.example.moduche.domain.course;

import jakarta.persistence.*;

import lombok.*;

@Entity @Table(name="course_type")
@Getter @Setter @NoArgsConstructor
public class CourseType {
    @Id
    @Column(name = "type_code")   // PK 컬럼
    private String typeCode;

    @Column(name = "type_name")   // 명시해두면 혼동 줄어듦
    private String typeName;
}