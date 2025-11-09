// CourseHeaderService.java
package com.example.moduche.domain.course.service;

import com.example.moduche.domain.course.DTO.CourseHeaderResponse;
public interface CourseHeaderService {
    CourseHeaderResponse getHeader(Long courseId);
}
