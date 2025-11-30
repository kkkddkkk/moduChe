package com.example.moduche.domain.course.service;

import com.example.moduche.domain.course.DTO.EnrollmentCreateRequest;
import com.example.moduche.domain.course.DTO.EnrollmentResponse;
import com.example.moduche.domain.course.DTO.EnrollUserProfileResponse;
import com.example.moduche.domain.facility.dto.EnrollmentForFacilityResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EnrollmentService {

    // ✅ 일반 유저: 수강신청
    EnrollmentResponse enroll(Long courseId, EnrollmentCreateRequest request);

    // ✅ 일반 유저: 수강신청 모달용 내 정보
    EnrollUserProfileResponse getEnrollUserProfile();

    // ✅ 시설 유저: 내 시설의 승인대기 신청 목록
    Page<EnrollmentForFacilityResponse> getFacilityPendingEnrollments(Pageable pageable);

    // ✅ 시설 유저: 수강신청 승인
    void approveEnrollment(Long enrollmentId);

    // ✅ 시설 유저: 수강신청 거절
    void rejectEnrollment(Long enrollmentId);
}
