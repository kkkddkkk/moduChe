// src/main/java/com/example/moduche/domain/myPage/controller/MyCourseController.java
package com.example.moduche.domain.myPage.controller;

import com.example.moduche.domain.myPage.dto.MyEnrolledCourseResponse;
import com.example.moduche.domain.myPage.service.MyCourseService;
import com.example.moduche.domain.login.User;
import com.example.moduche.repository.UserRepository;
import com.example.moduche.global.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/course")
@RequiredArgsConstructor
public class MyCourseController {

    private final MyCourseService myCourseService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @GetMapping("/me/enrollments")
    public ResponseEntity<List<MyEnrolledCourseResponse>> getMyEnrollments(
            HttpServletRequest request
    ) {
        // 1) Authorization 헤더로부터 토큰 직접 추출
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalStateException("JWT 토큰이 필요합니다.");
        }

        String token = authHeader.substring(7);

        // 2) 토큰에서 username 추출
        String username = jwtTokenProvider.getUsername(token);

        // 3) 유저 조회 (기존 레포지토리 방식 그대로 사용)
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new IllegalStateException("유저를 찾을 수 없습니다."));

        // 4) 해당 유저의 수강 신청 결과 조회
        List<MyEnrolledCourseResponse> list =
                myCourseService.getMyEnrolledCourses(user.getUserId());

        return ResponseEntity.ok(list);
    }
}
