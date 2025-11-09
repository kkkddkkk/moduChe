package com.example.moduche.domain.course.DTO;

public record CourseSidebarResponse(
    Long courseId,
    String priceText,     // "120,000 KRW" 같은 프리셋(정확한 가격 테이블 생기면 교체)
    Integer enrolled,     // 현재 신청 인원 (세션 기준)
    Integer capacity,     // 수강 가능 정원 (코스 혹은 세션별 오버라이드)
    Integer spotsLeft,    // capacity - enrolled
    String selectedSessionId,
    String selectedDate,  // "Nov 04 19:00"
    String refundPolicy   // "첫 수업 24시간 전 100% 환불"
) {}
