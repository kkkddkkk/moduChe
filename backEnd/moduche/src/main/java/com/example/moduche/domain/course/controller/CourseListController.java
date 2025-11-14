// src/main/java/com/example/moduche/domain/course/controller/CourseListController.java
package com.example.moduche.domain.course.controller;

import com.example.moduche.domain.course.DTO.CourseListResponse;
import com.example.moduche.domain.course.service.CourseListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/courses")
public class CourseListController {

    private final CourseListService courseListService;

    @GetMapping   // ★ GET /api/courses
    public ResponseEntity<List<CourseListResponse>> getCourseList() {
        System.out.println("=== [CourseListController] /api/courses 들어옴");
        List<CourseListResponse> list = courseListService.getCourseList();
        System.out.println("=== [CourseListController] 반환 개수 = " + list.size());
        return ResponseEntity.ok(list);
    }
}
