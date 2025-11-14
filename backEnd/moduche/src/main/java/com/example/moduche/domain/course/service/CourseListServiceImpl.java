// src/main/java/com/example/moduche/domain/course/service/CourseListServiceImpl.java
package com.example.moduche.domain.course.service;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.DTO.CourseListResponse;
import com.example.moduche.domain.course.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseListServiceImpl implements CourseListService {

    private final CourseRepository courseRepository;

    @Override
    public List<CourseListResponse> getCourseList() {

        System.out.println("=== [CourseListService] getCourseList 호출됨");

        // ✅ 일단 첫 페이지 12개만 가져오기 (0-based page index)
        Pageable pageable = PageRequest.of(0, 12);
        var page = courseRepository.findAllByOrderByCreatedAtDesc(pageable);

        System.out.println("=== [CourseListService] DB에서 가져온 row 수 = " + page.getNumberOfElements());

        return page.getContent().stream()
                .map(this::toDto)
                .toList();
    }

    private CourseListResponse toDto(Course c) {
        return CourseListResponse.builder()
                .courseId(c.getCourseId())
                .title(c.getTitle())
                .summary(
                        c.getSummary() != null && !c.getSummary().isBlank()
                                ? c.getSummary()
                                : safeCut(c.getDescription(), 40)
                )
                .facilityName(
                        c.getFacility() != null
                                ? c.getFacility().getFacilityName()
                                : "센터 미지정"
                )
                .thumbnailUrl(c.getThumbnailUrl())
                .maxParticipants(c.getMaxParticipants())
                .createdAt(c.getCreatedAt())
                .build();
    }

    private String safeCut(String s, int len) {
        if (s == null) return "";
        return s.length() <= len ? s : s.substring(0, len) + "...";
    }
}
