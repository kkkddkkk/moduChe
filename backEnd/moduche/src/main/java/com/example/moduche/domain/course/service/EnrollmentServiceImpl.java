package com.example.moduche.domain.course.service;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.CourseEnrollment;
import com.example.moduche.domain.course.CourseSession;
import com.example.moduche.domain.course.DTO.EnrollmentCreateRequest;
import com.example.moduche.domain.course.DTO.EnrollmentResponse;
import com.example.moduche.domain.course.DTO.EnrollUserProfileResponse;
import com.example.moduche.domain.course.Enums.EnrollmentStatus;
import com.example.moduche.domain.course.repository.CourseEnrollmentRepository;
import com.example.moduche.domain.course.repository.CourseRepository;
import com.example.moduche.domain.course.repository.CourseSessionRepository;
import com.example.moduche.domain.facility.dto.EnrollmentForFacilityResponse;
import com.example.moduche.domain.facility.repository.FacilityUserRepository;
import com.example.moduche.domain.login.User;
import com.example.moduche.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class EnrollmentServiceImpl implements EnrollmentService {

    private final CourseEnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final CourseSessionRepository courseSessionRepository;   // ✅ 추가
    private final UserRepository userRepository;
    private final FacilityUserRepository facilityUserRepository;

    // =========================
    // 1. 일반 유저 수강신청
    // =========================
    @Override
    public EnrollmentResponse enroll(Long courseId, EnrollmentCreateRequest request) {

        // 1) 현재 로그인한 유저
        User user = getCurrentUser();

        // 2) 강좌 조회
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new IllegalArgumentException("해당 강좌를 찾을 수 없습니다. courseId=" + courseId));

        // 3) 실제 세션(PK) 조회
        Long requestedSessionId = request.getSessionId();   // 🔥 프론트에서 오는 건 이제 CourseSession.sessionId 라고 가정
        CourseSession session = courseSessionRepository.findById(requestedSessionId)
                .orElseThrow(() ->
                        new NoSuchElementException("해당 세션을 찾을 수 없습니다. sessionId=" + requestedSessionId));

        // 이 세션이 이 코스에 소속된 세션인지 검증
        if (!session.getCourse().getCourseId().equals(courseId)) {
            throw new IllegalArgumentException("해당 코스의 세션이 아닙니다. courseId=" +
                    courseId + ", sessionId=" + requestedSessionId);
        }

        // 4) 날짜 파싱 ("YYYY-MM-DD")
        LocalDate date = LocalDate.parse(request.getDate());

        // 5) 중복 신청 체크
        boolean duplicate = enrollmentRepository
                .existsByCourse_CourseIdAndUser_UserIdAndSessionIdAndDate(
                        course.getCourseId(),
                        user.getUserId(),
                        session.getSessionId(),   // ✅ PK 기준
                        date
                );
        if (duplicate) {
            throw new IllegalStateException("이미 해당 강좌/세션/날짜에 신청한 이력이 있습니다.");
        }

        // 6) (옵션) 정원 체크 – CourseHeader 와 동일한 규칙 사용
        int capacity = (session.getCapacityOverride() != null)
                ? session.getCapacityOverride()
                : (course.getMaxParticipants() != null ? course.getMaxParticipants() : 0);

        long approvedCount = enrollmentRepository
                .countByCourse_CourseIdAndSessionIdAndStatus(
                        course.getCourseId(),
                        session.getSessionId(),
                        EnrollmentStatus.APPROVED
                );

        if (approvedCount >= capacity) {
            throw new IllegalStateException("정원이 마감된 세션입니다.");
        }

        // 7) 엔티티 생성 (초기 상태: REQUESTED)
        CourseEnrollment enrollment = CourseEnrollment.builder()
                .course(course)
                .user(user)
                .sessionId(session.getSessionId())   // ✅ 이제 무조건 CourseSession PK가 들어감 (8 같은 값)
                .date(date)
                .status(EnrollmentStatus.REQUESTED)
                .build();

        CourseEnrollment saved = enrollmentRepository.save(enrollment);

        // 8) 응답 DTO
        return EnrollmentResponse.builder()
                .enrollmentId(saved.getEnrollmentId())
                .courseId(course.getCourseId())
                .sessionId(saved.getSessionId())
                .date(saved.getDate().toString())
                .status(saved.getStatus())
                .build();
    }

    // =========================
    // 2. 시설 유저 수강신청 관리
    // =========================
    @Override
    @Transactional(readOnly = true)
    public EnrollUserProfileResponse getEnrollUserProfile() {
        User user = getCurrentUser();

        return EnrollUserProfileResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .name(user.getName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EnrollmentForFacilityResponse> getFacilityEnrollments(Pageable pageable) {

        String username = getCurrentUsername();

        var facilityUser = facilityUserRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException(
                        "시설 유저 정보를 찾을 수 없습니다. username=" + username
                ));

        Long facilityId = facilityUser.getFacility().getFacilityId();

        var page = enrollmentRepository.findByCourse_Facility_FacilityId(
                facilityId,
                pageable
        );

        return page.map(e ->
                EnrollmentForFacilityResponse.builder()
                        .enrollmentId(e.getEnrollmentId())
                        .courseId(e.getCourse().getCourseId())
                        .courseTitle(e.getCourse().getTitle())
                        .sessionId(e.getSessionId())
                        .date(e.getDate())
                        .status(e.getStatus())
                        .userId(e.getUser().getUserId())
                        .username(e.getUser().getUsername())
                        .name(e.getUser().getName())
                        .phone(e.getUser().getPhone())
                        .email(e.getUser().getEmail())
                        .createdAt(e.getCreatedAt())
                        .build()
        );
    }

    @Override
    public void approveEnrollment(Long enrollmentId) {
        CourseEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 신청을 찾을 수 없습니다. id=" + enrollmentId));

        validateFacilityOwner(enrollment);

        enrollment.setStatus(EnrollmentStatus.APPROVED);
    }

    @Override
    public void rejectEnrollment(Long enrollmentId) {
        CourseEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 신청을 찾을 수 없습니다. id=" + enrollmentId));

        validateFacilityOwner(enrollment);

        enrollment.setStatus(EnrollmentStatus.REJECTED);
    }

    // =========================
    // 3. 공통 헬퍼
    // =========================

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new IllegalStateException("인증 정보가 없습니다.");
        }
        return auth.getName();
    }

    private User getCurrentUser() {
        String username = getCurrentUsername();

        return userRepository.findByUserName(username)
                .orElseThrow(() -> new IllegalStateException(
                        "로그인 유저 정보를 찾을 수 없습니다. username=" + username));
    }

    private void validateFacilityOwner(CourseEnrollment enrollment) {
        String username = getCurrentUsername();

        var facilityUser = facilityUserRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException(
                        "시설 유저 정보를 찾을 수 없습니다. username=" + username
                ));

        Long myFacilityId = facilityUser.getFacility().getFacilityId();
        Long targetFacilityId = enrollment.getCourse().getFacility().getFacilityId();

        if (!myFacilityId.equals(targetFacilityId)) {
            throw new IllegalStateException("해당 시설의 수강신청을 처리할 권한이 없습니다.");
        }
    }
}
