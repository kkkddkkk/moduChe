package com.example.moduche.domain.facility.controller;

import com.example.moduche.domain.facility.dto.FacilityDto;
import com.example.moduche.domain.facility.service.FacilityMyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/facility")
@RequiredArgsConstructor
public class FacilityMyController {

    private final FacilityMyService facilityMyService;

    /**
     * 현재 로그인한 유저의 시설 정보 조회
     * GET /api/facility/me
     */
    @GetMapping("/me")
    public FacilityDto getMyFacility(Authentication authentication) {
        String username = authentication.getName(); // JwtFilter 에서 넣어준 username
        return facilityMyService.getMyFacility(username);
    }
}
