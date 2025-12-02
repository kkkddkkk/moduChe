package com.example.moduche.domain.course.service;

import com.example.moduche.domain.course.DTO.EnrollmentCreateRequest;
import com.example.moduche.domain.course.DTO.EnrollmentResponse;
import com.example.moduche.domain.course.DTO.EnrollUserProfileResponse;
import com.example.moduche.domain.facility.dto.EnrollmentForFacilityResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EnrollmentService {

    /** 일반 유저: 수강신청 생성 */
    EnrollmentResponse enroll(Long courseId, EnrollmentCreateRequest request);

    /** 수강신청 모달용 현재 로그인 유저 정보 */
    EnrollUserProfileResponse getEnrollUserProfile();

    /** 시설 유저: 내 시설 수강신청 목록(상태 무관, 페이징) */
    Page<EnrollmentForFacilityResponse> getFacilityEnrollments(Pageable pageable);

    /** 시설 유저: 수강신청 승인 */
    void approveEnrollment(Long enrollmentId);

    /** 시설 유저: 수강신청 거절 */
    void rejectEnrollment(Long enrollmentId);
}
