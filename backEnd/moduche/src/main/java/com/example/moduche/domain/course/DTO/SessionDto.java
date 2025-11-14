package com.example.moduche.domain.course.DTO;

import java.time.LocalDate;

public record SessionDto(
    String id,            // "S1", "S2" ...
    String label,         // "Block (Nov 1–30)"
    Integer remaining,    // 세션별 잔여 정원(없으면 null)
    LocalDate startDate,
    LocalDate endDate,
    String startTime,     // "19:00"
    String endTime,       // "21:00"
    String dowMask,       // "0110010" (월(0)~일(6) 순)
    Integer interval,     // 주 간격 등 (없으면 null)
    Integer capacity, Integer enrolled
) {}