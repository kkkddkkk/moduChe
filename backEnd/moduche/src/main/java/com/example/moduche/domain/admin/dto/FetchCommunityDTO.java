package com.example.moduche.domain.admin.dto;

import java.time.LocalDateTime;

import com.example.moduche.domain.community.enums.CommunityStatus;

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
public class FetchCommunityDTO {
	private Long communityId;
	private String name;//동아리명
	private LocalDateTime createdAt;//개설시간
	private String username;// 제목
	private String founder; //운영 기관
	private CommunityStatus status;//활성화 여부
}
