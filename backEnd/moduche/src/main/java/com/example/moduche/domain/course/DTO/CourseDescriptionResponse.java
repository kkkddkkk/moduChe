package com.example.moduche.domain.course.DTO;

import java.util.List;

public record CourseDescriptionResponse(
    String title,
    String description,           // 본문
    List<String> tags,            // 태그 라벨 리스트
    String addressLine            // 시설 주소 (헤더와 동일하게 1줄)
    
) {}
