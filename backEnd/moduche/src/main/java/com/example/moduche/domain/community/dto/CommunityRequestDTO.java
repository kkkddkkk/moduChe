package com.example.moduche.domain.community.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.moduche.domain.community.enums.CommunityScheduleType;
import com.example.moduche.domain.login.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommunityRequestDTO {

	private Long communityId;
	private String name;
	private String purpose;
	private int maxMember;
	
	private CommunityScheduleType scheduleType;
	private String scheduleDetail;
	private String address;
	private String addressDetail;
	
	private BigDecimal geoLat;
	private BigDecimal geoLng;
	
	private String title;
	private String content;
	private String hashTags;
	//private String representativeImage;
	
	private User owner;
	private String founder;

	private LocalDateTime createdAt = LocalDateTime.now();
}
