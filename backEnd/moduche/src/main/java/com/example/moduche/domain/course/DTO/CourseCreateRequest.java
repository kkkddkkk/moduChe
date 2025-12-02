package com.example.moduche.domain.course.DTO;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class CourseCreateRequest {

    // 기본 정보 -----------------------------
    private String title;              // 강좌명
    private String summary;            // 1줄 요약
    private String description;        // 본문(HTML)
    private Integer maxParticipants;   // 정원
    private String format;             // "ONLINE" / "OFFLINE" / "HYBRID"
    private String status;             // "PUBLISHED" 등
    private String typeCode;           // course_type.type_code FK
    private Long facilityId;           // 시설 FK
    private String instructorName;

    // 운영/세션 관련 ------------------------

    /** "정기" 또는 "비정기" */
    private String scheduleType;

    /**
     * 프론트에서 만든 사람이 읽기 좋은 문자열
     * 예: "매주 월수금", "격주 화목", "5월 5일"
     */
    private String operationSchedule;

    /** 정기일 때: "매주", "격주", "매월" */
    private String weekFrequency;

    /** 정기일 때: 운영 요일 목록. 예: ["월","수","금"] */
    private List<String> days;

    /** 세션 운영 시작일 (YYYY-MM-DD) */
    private LocalDate sessionStartDate;

    /** 세션 운영 종료일 (YYYY-MM-DD) */
    private LocalDate sessionEndDate;

    /** 수업 시작 시간 (예: "19:00") */
    private String sessionStartTime;

    /** 수업 종료 시간 (예: "21:00") */
    private String sessionEndTime;

    // 해시태그 -------------------------------
    private List<String> hashtags;

    // 🔥 실제 활동 장소(외부 시설 포함) -------

    private String activityPlaceName;      // 진행 장소명
    private String activityAddress;        // 도로명 주소
    private String activityAddressDetail;  // 상세 주소
    private BigDecimal activityGeoLat;     // 좌표 (선택)
    private BigDecimal activityGeoLng;
}
