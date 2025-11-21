package com.example.moduche.domain.community.dto;

import java.math.BigDecimal;

import com.example.moduche.domain.community.enums.CommunityScheduleType;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MetaInfoEditRequestDTO {
	
	private String name;
	private String purpose;
	private int maxMember;

	private CommunityScheduleType scheduleType;
	private String scheduleDetail;
	private String address;
	private String addressDetail;
	
	private BigDecimal geoLat;
	private BigDecimal geoLng;
}
