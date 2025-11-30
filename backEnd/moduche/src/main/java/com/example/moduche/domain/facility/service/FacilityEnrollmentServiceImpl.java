package com.example.moduche.domain.facility.service;

import com.example.moduche.domain.course.CourseEnrollment;

import com.example.moduche.domain.course.repository.CourseEnrollmentRepository;
import com.example.moduche.domain.facility.FacilityUser;
import com.example.moduche.domain.facility.dto.EnrollmentSummaryResponse;
import com.example.moduche.domain.facility.repository.FacilityUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FacilityEnrollmentServiceImpl implements FacilityEnrollmentService {

    private final FacilityUserRepository facilityUserRepository;
    private final CourseEnrollmentRepository enrollmentRepository;

    @Override
    public List<EnrollmentSummaryResponse> getEnrollmentsForFacility() {

        // 1) 현재 로그인한 username
        String username = getCurrentUsername();

        // 2) username 으로 FacilityUser 조회
        FacilityUser facilityUser = facilityUserRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalStateException("시설 관리자 정보를 찾을 수 없습니다. username=" + username));

        Long facilityId = facilityUser.getFacility().getFacilityId();

        // 3) 해당 시설의 수강신청 목록 조회
        List<CourseEnrollment> enrollments =
                enrollmentRepository.findByCourse_Facility_FacilityId(facilityId);

        // 4) DTO 매핑
        return enrollments.stream()
                .map(e -> EnrollmentSummaryResponse.builder()
                        .enrollmentId(e.getEnrollmentId())
                        .courseId(e.getCourse().getCourseId())
                        .courseTitle(e.getCourse().getTitle())
                        .userName(e.getUser().getName())
                        .userPhone(e.getUser().getPhone())
                        .sessionId(e.getSessionId())
                        .date(e.getDate().toString())
                        .status(e.getStatus())
                        .build()
                )
                .toList();
    }

    /** SecurityContext 에서 username 꺼내기 */
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new IllegalStateException("인증 정보가 없습니다.");
        }
        return auth.getName();
    }
}
