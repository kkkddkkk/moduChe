package com.example.moduche.domain.course.DTO;

import java.time.LocalDate;

public record SessionDto(
        String id,         // "S1", "S2" ...
        String label,      // "1회차 · 2025.11.29 ~ 2025.12.20 · 매주 월수 18:00~20:00"
        Integer remaining, // 세션별 잔여 정원 (null 허용)
        LocalDate startDate,
        LocalDate endDate,
        String startTime,  // "19:00"
        String endTime,    // "21:00"
        String dowMask,    // "0110010" (월~일)
        Integer interval,  // 간격 (1=매주,2=격주 등, null 가능)
        Integer capacity,  // 이 세션 정원
        Integer enrolled,  // 이 세션에 승인된 인원 수
        Long sessionDbId   // 🔥 실제 CourseSession PK
) {}
