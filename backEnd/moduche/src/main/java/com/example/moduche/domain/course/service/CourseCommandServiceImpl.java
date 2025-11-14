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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CourseCommandServiceImpl implements CourseCommandService {

    private final CourseRepository courseRepository;
    private final CourseTypeRepository courseTypeRepository;
    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public CourseCreateResponse createCourse(CourseCreateRequest dto) {

    	 String username = jwtTokenProvider.getUsername(username);
         if (username == null) {
             throw new IllegalStateException("인증 정보가 없습니다. (username null)");
         }

         // 2) username 기반으로 User 조회 (❌ findById 쓰지 말 것)
         User creator = userRepository.findByUserName(username)
                 .orElseThrow(() -> new IllegalStateException("사용자를 찾을 수 없습니다: " + username));

         // 3) 코스 타입 조회 (null 안 들어가게 방어)
         CourseType courseType = null;
         if (req.getCourseType() != null && !req.getCourseType().isBlank()) {
             courseType = courseTypeRepository.findById(req.getCourseType())
                     .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 코스 타입: " + req.getCourseType()));
         }

        // 4) Course 엔티티 생성
        Course course = Course.builder()
                .title(dto.getTitle())
                .summary(dto.getSummary())
                .description(dto.getDescription())
                .createdBy(creator)
                .facility(facility)
                .courseType(courseType)
                .maxParticipants(dto.getMaxParticipants())
                .format(Course.CourseFormat.valueOf(dto.getFormat()))
                .status(Course.CourseStatus.valueOf(dto.getStatus()))
                .viewCount(0L)
                .build();

        courseRepository.save(course);

        return new CourseCreateResponse(course.getCourseId(), "강좌 생성 완료");
    }
}
