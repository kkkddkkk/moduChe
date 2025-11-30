// src/main/java/com/example/moduche/domain/course/service/CourseListServiceImpl.java
package com.example.moduche.domain.course.service;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.DTO.CourseListResponse;
import com.example.moduche.domain.course.repository.CourseRepository;
import com.example.moduche.global.AWS.service.S3UrlSigner;   // 🔥 Presigned URL 추가

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URL;
import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseListServiceImpl implements CourseListService {

    private final CourseRepository courseRepository;
    private final S3UrlSigner s3UrlSigner;  // 🔥 주입

    @Override
    public List<CourseListResponse> getCourseList() {

        System.out.println("=== [CourseListService] getCourseList 호출됨");

        // 첫 페이지 12개
        Pageable pageable = PageRequest.of(0, 12);
        var page = courseRepository.findAllByOrderByCreatedAtDesc(pageable);

        System.out.println("=== [CourseListService] DB에서 가져온 row 수 = " + page.getNumberOfElements());

        return page.getContent().stream()
                .map(this::toDto)
                .toList();
    }

    private CourseListResponse toDto(Course c) {

        // 🔥 Presigned URL 변환
        String finalThumbUrl = null;
        String key = c.getThumbnailUrl();   // 예: course/uuid.webp

        if (key != null && !key.isBlank()) {
            try {
                URL signed = s3UrlSigner.sign(key, Duration.ofMinutes(30));
                finalThumbUrl = signed.toString();
            } catch (Exception e) {
                System.out.println("=== [WARN] 썸네일 presigned 생성 실패: " + key);
            }
        }

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

                // 🔥 여기!!! presigned URL 반환
                .thumbnailUrl(finalThumbUrl)

                .maxParticipants(c.getMaxParticipants())
                .createdAt(c.getCreatedAt())
                .build();
    }

    private String safeCut(String s, int len) {
        if (s == null) return "";
        return s.length() <= len ? s : s.substring(0, len) + "...";
    }
}
