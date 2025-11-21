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
import com.example.moduche.global.AWS.service.AWSService;
import com.example.moduche.global.security.JwtTokenProvider;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class CourseCommandServiceImpl implements CourseCommandService {

    private final CourseRepository courseRepository;
    private final CourseTypeRepository courseTypeRepository;
    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;
    // 필요하면 AWSService 같은 거 주입해서 이미지 처리

    @Override
    @Transactional
    public CourseCreateResponse registerCourse(Long ownerId,
                                               CourseCreateRequest dto,
                                               List<MultipartFile> images) {

        // 1) 작성자 조회 (userId로)
        User creator = userRepository.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. id=" + ownerId));

        // 2) 코스 타입 (nullable)
        CourseType courseType = null;
        if (dto.getTypeCode() != null && !dto.getTypeCode().isBlank()) {
            courseType = courseTypeRepository.findById(dto.getTypeCode())
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 코스 타입: " + dto.getTypeCode()));
        }

        // 3) 시설
        Facility facility = facilityRepository.findById(dto.getFacilityId())
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 시설 ID: " + dto.getFacilityId()));

        // 4) 포맷/상태 기본값 처리
        Course.CourseFormat format = Course.CourseFormat.OFFLINE;
        if (dto.getFormat() != null && !dto.getFormat().isBlank()) {
            format = Course.CourseFormat.valueOf(dto.getFormat()); // "OFFLINE", "ONLINE" 이런 값 들어온다고 가정
        }

        Course.CourseStatus status = Course.CourseStatus.PUBLISHED;
        if (dto.getStatus() != null && !dto.getStatus().isBlank()) {
            status = Course.CourseStatus.valueOf(dto.getStatus());
        }

        // 5) 코스 생성
        Course course = Course.builder()
                .title(dto.getTitle())
                .summary(dto.getSummary())
                .description(dto.getDescription()) // 🔥 Quill 본문 그대로 들어오는 필드
                .createdBy(creator)
                .facility(facility)
                .courseType(courseType)
                .maxParticipants(dto.getMaxParticipants())
                .format(format)
                .status(status)
                .viewCount(0L)
                .build();

        courseRepository.save(course);

        // 6) 이미지 처리 (있으면)
        if (images != null && !images.isEmpty()) {
            // TODO: AWSService 등 붙여서 course 이미지 저장
            // for (MultipartFile file : images) { ... }
        }

        return new CourseCreateResponse(course.getCourseId(), "강좌 생성 완료");
    }
}


