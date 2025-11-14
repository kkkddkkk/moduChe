// src/main/java/com/example/moduche/domain/course/DTO/CourseListResponse.java
package com.example.moduche.domain.course.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseListResponse {

    private Long courseId;
    private String title;          // 강좌 제목
    private String summary;        // 한 줄 요약 (없으면 description 일부 잘라서 사용해도 됨)
    private String facilityName;   // 시설 이름
    private String thumbnailUrl;   // 카드 썸네일
    private Integer maxParticipants;
    private LocalDateTime createdAt;
}
