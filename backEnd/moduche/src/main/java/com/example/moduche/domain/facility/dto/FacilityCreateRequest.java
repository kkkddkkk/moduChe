package com.example.moduche.domain.facility.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter
public class FacilityCreateRequest {

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

    private String status; // ACTIVE / INACTIVE 등
}
