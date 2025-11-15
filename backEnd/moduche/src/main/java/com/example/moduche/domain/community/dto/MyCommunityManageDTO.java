package com.example.moduche.domain.community.dto;

import java.time.LocalDateTime;

import com.example.moduche.domain.community.enums.CommunityMemberRole;
import com.example.moduche.domain.community.enums.CommunityMemberStatus;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MyCommunityManageDTO {

	// 작성자: 고은설.
	// 일반 회원에 의한 내가 소속된 동아리 목록 조회용 DTO.
	private Long communityId;
	private String name;
	private String ownerName;

	private LocalDateTime joinedAt;
	private LocalDateTime quitAt;
	private LocalDateTime createdAt;

	private CommunityMemberRole role;
	private CommunityMemberStatus status;
}
