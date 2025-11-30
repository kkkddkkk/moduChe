package com.example.moduche.domain.course.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnrollmentCreateRequest {

    /** 선택한 세션 ID */
    private Long sessionId;

    /** 선택한 날짜 (예: "2025-12-01") */
    private String date;
}
