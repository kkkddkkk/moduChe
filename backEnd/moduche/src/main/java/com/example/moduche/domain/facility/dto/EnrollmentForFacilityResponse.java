// src/main/java/com/example/moduche/domain/facility/dto/EnrollmentForFacilityResponse.java
package com.example.moduche.domain.facility.dto;

import com.example.moduche.domain.course.Enums.EnrollmentStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentForFacilityResponse {

    private Long enrollmentId;

    private Long courseId;
    private String courseTitle;

    private Long sessionId;
    private LocalDate date;

    private EnrollmentStatus status;

    // 신청자 정보
    private Long userId;
    private String username;
    private String name;
    private String phone;
    private String email;

    // 신청일
    private LocalDateTime createdAt;
}
