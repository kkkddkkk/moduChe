package com.example.moduche.domain.myPage.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class MyEnrolledCourseResponse {
    Long enrollmentId;   // 수강신청 PK
    Long courseId;       // 강좌 PK

    String title;        // 강좌명
    String facilityName; // 시설/기관명

    String period;       // "2025.01.10 ~ 2025.03.10"
    String dayTime;      // "매주 화/목 19:00 ~ 20:00"

    String status;       // "ongoing" / "finished"
}
