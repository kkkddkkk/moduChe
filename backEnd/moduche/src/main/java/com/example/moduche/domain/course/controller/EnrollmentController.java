package com.example.moduche.domain.course.controller;

import com.example.moduche.domain.course.DTO.EnrollmentCreateRequest;
import com.example.moduche.domain.course.DTO.EnrollmentResponse;
import com.example.moduche.domain.course.DTO.EnrollUserProfileResponse;
import com.example.moduche.domain.course.service.EnrollmentService;
import com.example.moduche.domain.facility.dto.EnrollmentForFacilityResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/course")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    /** ✅ 일반 유저: 수강신청 생성 */
    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<EnrollmentResponse> enroll(
            @PathVariable("courseId") Long courseId,
            @RequestBody EnrollmentCreateRequest request
    ) {
        EnrollmentResponse response = enrollmentService.enroll(courseId, request);
        return ResponseEntity.ok(response);
    }

    /** ✅ 수강신청 모달에서 사용할 현재 로그인 유저 정보 */
    @GetMapping("/enroll/me")
    public ResponseEntity<EnrollUserProfileResponse> getEnrollUserProfile() {
        EnrollUserProfileResponse profile = enrollmentService.getEnrollUserProfile();
        return ResponseEntity.ok(profile);
    }

    // =========================
    // 🔹 시설 유저용 수강신청 관리
    // =========================

    /** ✅ 시설 유저: 내 시설의 수강신청 목록 조회 (상태 무관) */
    @GetMapping("/facility/enrollments")
    public ResponseEntity<Page<EnrollmentForFacilityResponse>> getFacilityEnrollments(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EnrollmentForFacilityResponse> result =
                enrollmentService.getFacilityEnrollments(pageable);

        return ResponseEntity.ok(result);
    }

    /** ✅ 시설 유저: 수강신청 승인 */
    @PostMapping("/enroll/{enrollmentId}/approve")
    public ResponseEntity<Void> approveEnrollment(
            @PathVariable(name = "enrollmentId") Long enrollmentId
    ) {
        enrollmentService.approveEnrollment(enrollmentId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/enroll/{enrollmentId}/reject")
    public ResponseEntity<Void> rejectEnrollment(
            @PathVariable(name = "enrollmentId") Long enrollmentId
    ) {
        enrollmentService.rejectEnrollment(enrollmentId);
        return ResponseEntity.ok().build();
    }
}
