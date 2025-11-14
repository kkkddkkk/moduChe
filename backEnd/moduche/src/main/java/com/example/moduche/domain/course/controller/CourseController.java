// CourseController.java
package com.example.moduche.domain.course.controller;

import com.example.moduche.domain.course.DTO.CourseCreateRequest;
import com.example.moduche.domain.course.DTO.CourseCreateResponse;
import com.example.moduche.domain.course.service.CourseCommandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseCommandService courseCommandService;

    @PostMapping
    public ResponseEntity<CourseCreateResponse> createCourse(
            @RequestBody CourseCreateRequest req
    ) {
        CourseCreateResponse res = courseCommandService.createCourse(req); // ✅ 타입 일치
        return ResponseEntity.ok(res);
    }
}
