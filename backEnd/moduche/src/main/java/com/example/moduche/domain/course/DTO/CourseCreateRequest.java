package com.example.moduche.domain.course.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseCreateRequest {

    private String title;              // 강좌명
    private String summary;            // 1줄 요약
    private String description;        // 본문
    private Integer maxParticipants;   // 정원
    private String format;             // ONLINE / OFFLINE / HYBRID
    private String status;             // PUBLISHED 등
    private String typeCode;           // course_type FK
    private Long facilityId;           // 시설 FK
    private Long creatorUserId;        // 작성자(User) PK
}
