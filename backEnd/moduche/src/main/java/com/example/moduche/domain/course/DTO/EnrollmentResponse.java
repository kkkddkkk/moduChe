package com.example.moduche.domain.course.DTO;

import com.example.moduche.domain.course.Enums.EnrollmentStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EnrollmentResponse {

    private Long enrollmentId;
    private Long courseId;
    private Long sessionId;
    private String date;
    private EnrollmentStatus status;
}
