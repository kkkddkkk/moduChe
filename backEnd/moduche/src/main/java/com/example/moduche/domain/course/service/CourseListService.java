
package com.example.moduche.domain.course.service;

import com.example.moduche.domain.course.DTO.CourseListResponse;

import java.util.List;

public interface CourseListService {
    List<CourseListResponse> getCourseList();
}
