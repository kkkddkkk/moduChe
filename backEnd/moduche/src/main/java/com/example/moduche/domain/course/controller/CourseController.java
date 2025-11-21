// CourseController.java
package com.example.moduche.domain.course.controller;

import com.example.moduche.domain.course.DTO.CourseCreateRequest;
import com.example.moduche.domain.course.DTO.CourseCreateResponse;
import com.example.moduche.domain.course.service.CourseCommandService;
import com.example.moduche.domain.login.User;
import com.example.moduche.global.security.JwtTokenProvider;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/course")
public class CourseController {

    private final CourseCommandService courseCommandService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    private Long extractUserId(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Authorization header required");
        }
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtTokenProvider.getUsername(token);

        return userRepository.findByUserName(username)
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<CourseCreateResponse> registerCourse(
            @RequestHeader("Authorization") String tokenHeader,
            @RequestPart("data") CourseCreateRequest dto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        Long userId = extractUserId(tokenHeader);
        CourseCreateResponse res = courseCommandService.registerCourse(userId, dto, images);
        return ResponseEntity.ok(res);
    }
}

