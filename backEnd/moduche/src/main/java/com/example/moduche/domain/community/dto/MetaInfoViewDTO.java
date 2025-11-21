package com.example.moduche.domain.community.dto;

import java.time.LocalDateTime;

import com.example.moduche.domain.community.enums.CommunityScheduleType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MetaInfoViewDTO {
	
	private Long communityId;
	private String name;
	private String purpose;
	private int maxMember;
	private int currentMember;

	private String founder;
	private LocalDateTime createdAt;

	private CommunityScheduleType scheduleType;
	private String scheduleDetail;
	private String address;
	private String addressDetail;
}
