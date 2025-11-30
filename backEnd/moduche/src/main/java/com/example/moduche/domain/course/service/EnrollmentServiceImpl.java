package com.example.moduche.domain.course.service;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.CourseEnrollment;
import com.example.moduche.domain.course.DTO.EnrollmentCreateRequest;
import com.example.moduche.domain.course.DTO.EnrollmentResponse;
import com.example.moduche.domain.course.DTO.EnrollUserProfileResponse;
import com.example.moduche.domain.course.Enums.EnrollmentStatus;
import com.example.moduche.domain.course.repository.CourseEnrollmentRepository;
import com.example.moduche.domain.course.repository.CourseRepository;
import com.example.moduche.domain.facility.repository.FacilityUserRepository;
import com.example.moduche.domain.facility.dto.EnrollmentForFacilityResponse;
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

@Service
@RequiredArgsConstructor
@Transactional
public class EnrollmentServiceImpl implements EnrollmentService {

    private final CourseEnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final FacilityUserRepository facilityUserRepository; // ✅ 시설 유저 확인용

    // =========================
    // 1. 일반 유저 수강신청
    // =========================
    @Override
    public EnrollmentResponse enroll(Long courseId, EnrollmentCreateRequest request) {

        // 1) 강좌 조회
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("해당 강좌를 찾을 수 없습니다. courseId=" + courseId));

        // 2) 현재 로그인한 유저 조회
        User user = getCurrentUser();

        // 3) 날짜 파싱
        LocalDate date = LocalDate.parse(request.getDate()); // "YYYY-MM-DD"

        // 4) 중복 신청 체크
        boolean duplicate = enrollmentRepository.existsByCourse_CourseIdAndUser_UserIdAndSessionIdAndDate(
                course.getCourseId(),
                user.getUserId(),
                request.getSessionId(),
                date
        );
        if (duplicate) {
            throw new IllegalStateException("이미 해당 강좌/세션/날짜에 신청한 이력이 있습니다.");
        }

        // 5) 엔티티 생성 (상태는 REQUESTED)
        CourseEnrollment enrollment = CourseEnrollment.builder()
                .course(course)
                .user(user)
                .sessionId(request.getSessionId())
                .date(date)
                .status(EnrollmentStatus.REQUESTED)
                .build();

        CourseEnrollment saved = enrollmentRepository.save(enrollment);

        // 6) 응답 DTO
        return EnrollmentResponse.builder()
                .enrollmentId(saved.getEnrollmentId())
                .courseId(course.getCourseId())
                .sessionId(saved.getSessionId())
                .date(saved.getDate().toString())
                .status(saved.getStatus())
                .build();
    }

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

    // =========================
    // 2. 시설 유저 수강신청 관리
    // =========================

    /** ✅ 시설 유저: 내 시설의 승인대기(REQUESTED) 신청 목록 */
    @Override
    @Transactional(readOnly = true)
    public Page<EnrollmentForFacilityResponse> getFacilityPendingEnrollments(Pageable pageable) {

        String username = getCurrentUsername();

        var facilityUser = facilityUserRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException(
                        "시설 유저 정보를 찾을 수 없습니다. username=" + username
                ));

        Long facilityId = facilityUser.getFacility().getFacilityId();

        var page = enrollmentRepository.findByCourse_Facility_FacilityIdAndStatus(
                facilityId,
                EnrollmentStatus.REQUESTED,
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

    /** ✅ 시설 유저: 수강신청 승인 */
    @Override
    public void approveEnrollment(Long enrollmentId) {
        CourseEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 신청을 찾을 수 없습니다. id=" + enrollmentId));

        validateFacilityOwner(enrollment);

        enrollment.setStatus(EnrollmentStatus.APPROVED);
        // TODO: 추후 잔여석 감소 로직은 여기서 처리 가능
    }

    /** ✅ 시설 유저: 수강신청 거절 */
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

    /** SecurityContext에서 username 문자열만 꺼내기 */
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new IllegalStateException("인증 정보가 없습니다.");
        }
        return auth.getName();
    }

    /** username 으로 User 엔티티 조회 */
    private User getCurrentUser() {
        String username = getCurrentUsername();

        return userRepository.findByUserName(username)
                .orElseThrow(() -> new IllegalStateException(
                        "로그인 유저 정보를 찾을 수 없습니다. username=" + username));
    }

    /** 이 수강신청이 현재 시설 유저의 시설 소속인지 검사 */
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
