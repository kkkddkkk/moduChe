package com.example.moduche.domain.course.service;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.CourseType;
import com.example.moduche.domain.course.DTO.CourseCreateRequest;
import com.example.moduche.domain.course.DTO.CourseCreateResponse;
import com.example.moduche.domain.course.repository.CourseRepository;
import com.example.moduche.domain.course.repository.CourseTypeRepository;
import com.example.moduche.domain.facility.Facility;
import com.example.moduche.domain.facility.repository.FacilityRepository;
import com.example.moduche.domain.login.User;
import com.example.moduche.global.security.JwtTokenProvider;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CourseCommandServiceImpl implements CourseCommandService {

    private final CourseRepository courseRepository;
    private final CourseTypeRepository courseTypeRepository;
    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CourseCreateResponse createCourse(CourseCreateRequest req) {

        // 1) SecurityContext에서 인증 정보 꺼내기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("인증 정보가 없습니다. (SecurityContext authentication null)");
        }

        String username = authentication.getName();

        // 2) username 기반 User 조회
        User creator = userRepository.findByUserName(username)
                .orElseThrow(() -> new IllegalStateException("사용자를 찾을 수 없습니다: " + username));

        // 3) 코스 타입 조회 (nullable)
        CourseType courseType = null;
        if (req.getTypeCode() != null && !req.getTypeCode().isBlank()) {
            courseType = courseTypeRepository.findById(req.getTypeCode())
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 코스 타입: " + req.getTypeCode()));
        }

        // 4) Facility 조회
        Facility facility = facilityRepository.findById(req.getFacilityId())
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 시설 ID: " + req.getFacilityId()));

        // 5) Course 엔티티 생성
        Course course = Course.builder()
                .title(req.getTitle())
                .summary(req.getSummary())
                .description(req.getDescription())
                .createdBy(creator)
                .facility(facility)
                .courseType(courseType)
                .maxParticipants(req.getMaxParticipants())
                .format(Course.CourseFormat.valueOf(req.getFormat()))
                .status(Course.CourseStatus.valueOf(req.getStatus()))
                .viewCount(0L)
                .build();

        courseRepository.save(course);

        return new CourseCreateResponse(course.getCourseId(), "강좌 생성 완료");
    }
}


