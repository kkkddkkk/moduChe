package com.example.moduche.domain.facility.dto;

import com.example.moduche.domain.facility.Facility;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacilityDto {

    private Long facilityId;
    private String facilityName;
    private String facilityType;
    private String facilityAddress;

    private BigDecimal geoLat;
    private BigDecimal geoLng;

    private String facilityPhone;
    private String openHours;
    private String accessibilityFeatures;

    private String businessNum;
    private String boss;

    private String status;

    public static FacilityDto from(Facility f) {
        if (f == null) return null;

        return FacilityDto.builder()
                .facilityId(f.getFacilityId())
                .facilityName(f.getFacilityName())
                .facilityType(f.getFacilityType())
                .facilityAddress(f.getFacilityAddress())
                .geoLat(f.getGeoLat())
                .geoLng(f.getGeoLng())
                .facilityPhone(f.getFacilityPhone())
                .openHours(f.getOpenHours())
                .accessibilityFeatures(f.getAccessibilityFeatures())
                .businessNum(f.getBusiness_num())
                .boss(f.getBoss())
                .status(f.getStatus() != null ? f.getStatus().name() : null)
                .build();
    }
}
