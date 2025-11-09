package com.example.moduche.domain.course.service;

import com.example.moduche.domain.course.DTO.CourseDescriptionResponse;

public interface CourseDescriptionService {
    CourseDescriptionResponse getDescription(Long courseId);
}
