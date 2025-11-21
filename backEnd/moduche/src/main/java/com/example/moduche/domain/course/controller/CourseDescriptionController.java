package com.example.moduche.domain.course.controller;

import com.example.moduche.domain.course.DTO.CourseDescriptionResponse;
import com.example.moduche.domain.course.service.CourseDescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/course")
public class CourseDescriptionController {

    private final CourseDescriptionService service;

    @GetMapping("/{id}/description")
    public ResponseEntity<CourseDescriptionResponse> getDescription(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.getDescription(id));
    
    }
}
