package com.example.moduche.global.search;

import com.example.moduche.domain.course.Course.CourseFormat;
import com.example.moduche.domain.course.Course.CourseStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CourseSearchResultDto {

    private Long courseId;
    private String title;
    private String summary;
    private String thumbnailUrl;

    private String facilityName;
    private String address;

    private LocalDate periodStart;
    private LocalDate periodEnd;

    private CourseFormat format;
    private CourseStatus status;

    private Long viewCount;

    // ✅ 강좌 등록일
    private LocalDateTime createdAt;
}
