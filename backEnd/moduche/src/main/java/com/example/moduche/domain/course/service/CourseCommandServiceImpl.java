// src/main/java/com/example/moduche/domain/course/service/CourseCommandServiceImpl.java
package com.example.moduche.domain.course.service;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.CourseSession;
import com.example.moduche.domain.course.CourseType;
import com.example.moduche.domain.course.DTO.CourseCreateRequest;
import com.example.moduche.domain.course.DTO.CourseCreateResponse;
import com.example.moduche.domain.course.CoursePhoto;
import com.example.moduche.domain.course.repository.CoursePhotoRepository;
import com.example.moduche.domain.course.repository.CourseRepository;
import com.example.moduche.domain.course.repository.CourseSessionRepository;
import com.example.moduche.domain.course.repository.CourseTypeRepository;
import com.example.moduche.domain.facility.Facility;
import com.example.moduche.domain.facility.repository.FacilityRepository;
import com.example.moduche.domain.login.User;
import com.example.moduche.domain.tag.Tag;
import com.example.moduche.domain.tag.TagRepository;
import com.example.moduche.global.AWS.service.AWSService;
import com.example.moduche.global.security.JwtTokenProvider;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseCommandServiceImpl implements CourseCommandService {

    private final CourseRepository courseRepository;
    private final CourseTypeRepository courseTypeRepository;
    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;
    private final CourseSessionRepository courseSessionRepository;

    private final AWSService awsService;              // S3 업로드용 (커뮤니티에서 쓰던 것)
    private final JwtTokenProvider jwtTokenProvider;

    private final TagRepository tagRepository;
    private final CoursePhotoRepository coursePhotoRepository;

    @Override
    @Transactional
    public CourseCreateResponse registerCourse(Long ownerId,
                                               CourseCreateRequest dto,
                                               List<MultipartFile> images) {

        // 1) 작성자
        User creator = userRepository.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. id=" + ownerId));

        // 2) 코스 타입
        CourseType courseType = null;
        String typeCode = dto.getTypeCode();

        if (StringUtils.hasText(typeCode)) {
            CourseType existing = courseTypeRepository.findByTypeCode(typeCode);
            if (existing != null) {
                courseType = existing;
            } else {
                CourseType t = new CourseType();
                t.setTypeCode(typeCode);
                t.setTypeName(typeCode);
                courseType = courseTypeRepository.save(t);
            }
        }

        // 3) 시설
        Facility facility = facilityRepository.findById(dto.getFacilityId())
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 시설 ID: " + dto.getFacilityId()));

        // 4) 포맷/상태
        Course.CourseFormat format = Course.CourseFormat.OFFLINE;
        if (dto.getFormat() != null && !dto.getFormat().isBlank()) {
            format = Course.CourseFormat.valueOf(dto.getFormat());
        }

        Course.CourseStatus status = Course.CourseStatus.PUBLISHED;
        if (dto.getStatus() != null && !dto.getStatus().isBlank()) {
            status = Course.CourseStatus.valueOf(dto.getStatus());
        }

        // 5) 코스 엔티티 생성
        Course course = Course.builder()
                .title(dto.getTitle())
                .summary(dto.getSummary())
                .description(dto.getDescription())
                .createdBy(creator)
                .facility(facility)
                .courseType(courseType)
                .maxParticipants(dto.getMaxParticipants())
                .format(format)
                .status(status)
                .viewCount(0L)
                .operationSchedule(dto.getOperationSchedule())
                .instructorName(dto.getInstructorName())
                .activityPlaceName(dto.getActivityPlaceName())
                .activityAddress(dto.getActivityAddress())
                .activityAddressDetail(dto.getActivityAddressDetail())
                .activityGeoLat(dto.getActivityGeoLat())
                .activityGeoLng(dto.getActivityGeoLng())
                .build();

        // 6) 태그 연결
        attachTagsToCourse(course, dto.getHashtags());

        // 7) 코스 저장 (PK 확보)
        courseRepository.save(course);

        // 8) 정기 스케줄이면 세션 생성
        if ("정기".equals(dto.getScheduleType())) {
            createRegularSession(course, dto);
        }

        // 9) 이미지 업로드 + 썸네일 키 저장
        if (images != null && !images.isEmpty()) {
            boolean first = true;

            for (MultipartFile file : images) {
                if (file == null || file.isEmpty()) continue;

                // 🔥 "course/xxx.webp" 형태의 키 반환
                String objectKey = awsService.upload(file, "course");

                // 사진 엔티티
                CoursePhoto photo = CoursePhoto.builder()
                        .course(course)
                        .photoUrl(objectKey)  // 키 저장
                        .build();
                coursePhotoRepository.save(photo);

                if (first) {
                    first = false;
                    course.setThumbnailUrl(objectKey); // 🔥 썸네일에도 키 저장
                }
            }

            courseRepository.save(course);
        }

        return new CourseCreateResponse(course.getCourseId(), "강좌가 생성되었습니다.");
    }

    private void attachTagsToCourse(Course course, List<String> hashtags) {
        if (hashtags == null || hashtags.isEmpty()) return;

        for (String raw : hashtags) {
            String tagCode = normalizeTag(raw);
            if (tagCode == null || tagCode.isBlank()) continue;

            Tag tag = tagRepository.findByCode(tagCode)
                    .orElseGet(() -> tagRepository.save(
                            Tag.builder()
                                    .code(tagCode)
                                    .name(tagCode)
                                    .category("course")
                                    .build()
                    ));

            course.getTags().add(tag);
        }
    }

    private String normalizeTag(String raw) {
        if (raw == null) return null;
        String n = raw.trim();
        if (n.isEmpty()) return null;
        if (n.startsWith("#")) {
            n = n.substring(1);
        }
        return n.toLowerCase();
    }

    private void createRegularSession(Course course, CourseCreateRequest dto) {
        CourseSession session = new CourseSession();
        session.setCourse(course);
        session.setStartDate(dto.getSessionStartDate());
        session.setEndDate(dto.getSessionEndDate());
        session.setStartTime(dto.getSessionStartTime());
        session.setEndTime(dto.getSessionEndTime());

        if (dto.getSessionStartDate() != null && dto.getSessionStartTime() != null) {
            LocalTime startTime = LocalTime.parse(dto.getSessionStartTime());
            session.setStartAt(LocalDateTime.of(dto.getSessionStartDate(), startTime));
        }
        if (dto.getSessionEndDate() != null && dto.getSessionEndTime() != null) {
            LocalTime endTime = LocalTime.parse(dto.getSessionEndTime());
            session.setEndAt(LocalDateTime.of(dto.getSessionEndDate(), endTime));
        }

        session.setDowMask(buildDowMask(dto.getDays()));
        session.setInterval(mapWeekFrequencyToInterval(dto.getWeekFrequency()));
        session.setCapacityOverride(null);

        courseSessionRepository.save(session);
    }

    private String buildDowMask(List<String> days) {
        if (days == null || days.isEmpty()) return "0000000";

        List<String> order = List.of("월","화","수","목","금","토","일");
        StringBuilder sb = new StringBuilder();
        for (String d : order) {
            sb.append(days.contains(d) ? '1' : '0');
        }
        return sb.toString();
    }

    private Integer mapWeekFrequencyToInterval(String weekFrequency) {
        if (weekFrequency == null || weekFrequency.isBlank()) return 1;
        return switch (weekFrequency) {
            case "매주" -> 1;
            case "격주" -> 2;
            case "매월" -> 4;
            default -> 1;
        };
    }
}
