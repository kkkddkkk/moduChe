package com.example.moduche.domain.facility.service;

import com.example.moduche.domain.facility.Facility;
import com.example.moduche.domain.facility.FacilityUser;
import com.example.moduche.domain.facility.dto.FacilityDto;
import com.example.moduche.domain.facility.repository.FacilityUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FacilityMyService {

    private final FacilityUserRepository facilityUserRepository;

    /**
     * 현재 로그인한 username 기준으로 시설 1개 가져오기
     * (FacilityUser 에 매핑된 Facility 사용)
     */
    public FacilityDto getMyFacility(String username) {
        FacilityUser fu = facilityUserRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("시설 사용자 정보가 없습니다. username=" + username));

        Facility facility = fu.getFacility();
        return FacilityDto.from(facility);
    }
}
