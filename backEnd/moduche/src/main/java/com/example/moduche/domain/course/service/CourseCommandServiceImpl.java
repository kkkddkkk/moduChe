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

    @Override
    @Transactional
    public CourseCreateResponse createCourse(CourseCreateRequest dto) {

        // 1) Creator 조회
        User creator = userRepository.findById(dto.getCreatorUserId())
                .orElseThrow(() -> new RuntimeException("생성자 정보를 찾을 수 없습니다."));

        // 2) Facility 조회
        Facility facility = facilityRepository.findById(dto.getFacilityId())
                .orElseThrow(() -> new RuntimeException("시설 정보가 없습니다."));

        // 3) Course Type 조회
        CourseType courseType = courseTypeRepository.findById(dto.getTypeCode())
                .orElseThrow(() -> new RuntimeException("유효하지 않은 typeCode 입니다."));

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
