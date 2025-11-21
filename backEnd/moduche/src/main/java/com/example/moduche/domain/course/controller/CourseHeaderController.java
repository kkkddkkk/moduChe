package com.example.moduche.domain.course.controller;

import com.example.moduche.domain.course.DTO.CourseHeaderResponse;
import com.example.moduche.domain.course.service.CourseHeaderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/course")
public class CourseHeaderController {

	private final CourseHeaderService courseHeaderService;

    // 강좌 헤더 조회
    @GetMapping("/{courseId}/header")
    public CourseHeaderResponse getHeader(@PathVariable("courseId") Long courseId) {
        return courseHeaderService.getHeader(courseId);
    }
}
