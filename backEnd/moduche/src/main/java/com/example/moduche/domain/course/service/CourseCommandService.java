package com.example.moduche.domain.course.service;

import com.example.moduche.domain.course.DTO.CourseCreateRequest;
import com.example.moduche.domain.course.DTO.CourseCreateResponse;

public interface CourseCommandService {
    CourseCreateResponse createCourse(CourseCreateRequest dto);
}