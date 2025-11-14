package com.example.moduche.domain.course.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CourseCreateResponse {
    private Long courseId;
    private String message;
}
