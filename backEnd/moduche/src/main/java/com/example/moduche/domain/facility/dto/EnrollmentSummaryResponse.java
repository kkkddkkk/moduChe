package com.example.moduche.domain.facility.dto;

import com.example.moduche.domain.course.Enums.EnrollmentStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EnrollmentSummaryResponse {
    private Long enrollmentId;
    private Long courseId;
    private String courseTitle;

    private String userName;
    private String userPhone;

    private Long sessionId;
    private String date;

    private EnrollmentStatus status;
}

