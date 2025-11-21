package com.example.moduche.domain.community.dto;

import java.time.LocalDateTime;

import com.querydsl.core.annotations.QueryProjection;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CommunityListResponseDTO {
	private Long communityId;
	private Long postId;
	private String name;
	private String desc;
	private String representativeImage;
	private LocalDateTime createdAt;
	private Long memberCount;
	private boolean isPromoted;

}
