package com.example.moduche.domain.course.controller;

import com.example.moduche.domain.course.DTO.CourseHeaderResponse;
import com.example.moduche.domain.course.service.CourseHeaderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/courses")
public class CourseHeaderController {

    private final CourseHeaderService headerService;

    @GetMapping("/{id}/header")
    public ResponseEntity<CourseHeaderResponse> getHeader(@PathVariable Long id) {
        return ResponseEntity.ok(headerService.getHeader(id));
    }
}
