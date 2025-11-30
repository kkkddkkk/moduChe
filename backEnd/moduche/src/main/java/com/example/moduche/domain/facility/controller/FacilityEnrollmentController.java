package com.example.moduche.domain.facility.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.moduche.domain.facility.dto.EnrollmentSummaryResponse;
import com.example.moduche.domain.facility.service.FacilityEnrollmentService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/facility/enrollments")
public class FacilityEnrollmentController {

    private final FacilityEnrollmentService facilityEnrollmentService;

    // 시설 관리자용 - 수강신청 목록 조회
    @GetMapping
    public ResponseEntity<List<EnrollmentSummaryResponse>> getEnrollments() {
        List<EnrollmentSummaryResponse> list = facilityEnrollmentService.getEnrollmentsForFacility();
        return ResponseEntity.ok(list);
    }
}
