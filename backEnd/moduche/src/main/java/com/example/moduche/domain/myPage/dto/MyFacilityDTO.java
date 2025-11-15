package com.example.moduche.domain.myPage.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyFacilityDTO {
	private String username;
	private String roleInFac;
	private String phone;
	private String facilityType;
	private String facilityAddress;
	private BigDecimal geoLat;
	private BigDecimal geoLng;
	private String openHours;
	private String businessNum;
	private String boss;
	private String accessibilityFeatures;
}
