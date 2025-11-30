package com.example.moduche.domain.admin.dto;

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
public class FetchCommunityDetailDTO {	
	private Long communityId;
	private String name;//동아리명
	private String purpose;//목적
	private String founder;//운영 기관
	private String roleInFac;//담당자명
	private String phone;//연락처
	private String address;//주소(주소+상세주소)
	private String scheduleDetail;//일정
	private CommunityStatus status;//활성화 여부
	private Long postId;//게시물 ID
	private String title;//게시물 제목
	
	public FetchCommunityDetailDTO(Long communityId, String name, String purpose, 
			String founder, String roleInFac, String phone, CommunityStatus status,
			Long postId, String title) {
		this.communityId = communityId;
		this.name = name;
		this.purpose = purpose;
		this.founder = founder;
		this.roleInFac = roleInFac;
		this.phone = phone;
		this.status = status;
		this.postId = postId;
		this.title = title;
	}
}
