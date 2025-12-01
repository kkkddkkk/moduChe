package com.example.moduche.domain.facility.controller;

import com.example.moduche.domain.facility.Facility;
import com.example.moduche.domain.facility.enums.FacilityStatus;
import com.example.moduche.domain.facility.repository.FacilityRepository;
import com.example.moduche.global.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@RequiredArgsConstructor
public class FacilityAdminController {

    private final FacilityRepository facilityRepository;
    private final JwtTokenProvider jwtTokenProvider;

    /** 관리자 권한 체크 */
    private void checkAdmin(String tokenHeader) {
        if (tokenHeader == null || !tokenHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization header missing");
        }

        String token = tokenHeader.replace("Bearer ", "").trim();
        String role = jwtTokenProvider.getRole(token);

        // SUPER_ADMIN, ADMIN 등 모두 허용
        if (!role.contains("ADMIN")) {
            throw new RuntimeException("관리자만 접근할 수 있습니다.");
        }

        System.out.println("[FACILITY ADMIN CHECK] ROLE = " + role);
    }

    /** 전체 조회 (검색 포함) */
    @GetMapping
    public List<Facility> listFacilities(
            @RequestHeader("Authorization") String tokenHeader,
            @RequestParam(value = "keyword", required = false) String keyword
    ) {
        checkAdmin(tokenHeader);

        if (keyword == null || keyword.trim().isEmpty()) {
            return facilityRepository.findAll();
        }
        return facilityRepository.searchFacilities(keyword.trim());
    }

    /** 단건 조회 */
    @GetMapping("/{id}")
    public Facility getFacility(
            @RequestHeader("Authorization") String tokenHeader,
            @PathVariable("id") Long id
    ) {
        checkAdmin(tokenHeader);

        return facilityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("시설이 존재하지 않습니다. id=" + id));
    }

    /** 등록 */
    @PostMapping
    public Facility createFacility(
            @RequestHeader("Authorization") String tokenHeader,
            @RequestBody Facility request
    ) {
        checkAdmin(tokenHeader);

        if (request.getGeoLat() != null)
            request.setGeoLat(new BigDecimal(request.getGeoLat().toString()));
        if (request.getGeoLng() != null)
            request.setGeoLng(new BigDecimal(request.getGeoLng().toString()));

        request.setStatus(FacilityStatus.ACTIVE);

        return facilityRepository.save(request);
    }

    /** 상태 변경 (ACTIVE ↔ SUSPENDED) */
    @PatchMapping("/{id}/status")
    public Facility changeStatus(
            @RequestHeader("Authorization") String tokenHeader,
            @PathVariable("id") Long id
    ) {
        checkAdmin(tokenHeader);

        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("시설이 존재하지 않습니다. id=" + id));

        switch (facility.getStatus()) {
            case ACTIVE -> facility.setStatus(FacilityStatus.SUSPENDED);
            case SUSPENDED -> facility.setStatus(FacilityStatus.ACTIVE);
            default -> throw new IllegalStateException("이 상태는 변경할 수 없습니다: " + facility.getStatus());
        }

        return facilityRepository.save(facility);
    }

    /** 삭제 */
    @DeleteMapping("/{id}")
    public void deleteFacility(
            @RequestHeader("Authorization") String tokenHeader,
            @PathVariable("id") Long id
    ) {
        checkAdmin(tokenHeader);

        if (!facilityRepository.existsById(id)) {
            throw new IllegalArgumentException("삭제할 시설이 존재하지 않습니다. id=" + id);
        }

        facilityRepository.deleteById(id);
    }
}
