package com.example.moduche.domain.facility.service;


import java.util.List;

import com.example.moduche.domain.facility.dto.EnrollmentSummaryResponse;

public interface FacilityEnrollmentService {
 List<EnrollmentSummaryResponse> getEnrollmentsForFacility();
}

