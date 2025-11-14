// src/main/java/com/example/moduche/domain/facility/controller/FacilityAdminController.java
package com.example.moduche.domain.facility.controller;

import com.example.moduche.domain.facility.Facility;
import com.example.moduche.domain.facility.repository.FacilityRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@RequiredArgsConstructor
public class FacilityAdminController {

    private final FacilityRepository facilityRepository;

    /**
     * 시설 목록 조회
     * GET /api/facilities
     *
     * 프론트 FacilityPage 에서 처음 진입 시 호출
     */
    @GetMapping
    public List<Facility> listFacilities() {
        return facilityRepository.findAll();
    }

    /**
     * (옵션) 단건 조회 – 나중에 상세 페이지 따로 빼고 싶을 때 사용 가능
     * GET /api/facilities/{id}
     */
    @GetMapping("/{id}")
    public Facility getFacility(@PathVariable Long id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("시설이 존재하지 않습니다. id=" + id));
    }

    /**
     * (옵션) 시설 생성 – 새 시설 등록 팝업에서 쓸 예정
     * POST /api/facilities
     *
     * body 예시:
     * {
     *   "facilityName": "OO 재활센터",
     *   "facilityType": "REHAB_CENTER",
     *   "facilityAddress": "서울시 ...",
     *   "geoLat": 37.55,
     *   "geoLng": 126.97,
     *   "facilityPhone": "02-123-4567",
     *   "openHours": "평일 09:00 ~ 18:00",
     *   "accessibilityFeatures": "휠체어 경사로, 엘리베이터",
     *   "status": "ACTIVE"
     * }
     */
    @PostMapping
    public Facility createFacility(@RequestBody Facility request) {
        // 아주 단순하게 바로 저장
        return facilityRepository.save(request);
    }
}
