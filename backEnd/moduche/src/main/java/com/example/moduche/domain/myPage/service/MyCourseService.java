package com.example.moduche.domain.myPage.service;

import com.example.moduche.domain.myPage.dto.MyEnrolledCourseResponse;
import java.util.List;

public interface MyCourseService {
    List<MyEnrolledCourseResponse> getMyEnrolledCourses(Long userId);
}
