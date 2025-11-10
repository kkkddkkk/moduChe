// 작성자: 고은설.
// 기능: 게시글 상세 페이지 응답 DTO.
package com.example.moduche.domain.community.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.moduche.domain.community.enums.CommunityScheduleType;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityPostDetailDTO {

	// 동아리 기본 정보.
	private Long communityId; // 고유 번호.
	private String name; // 동아리 이름.
	private int maxMember; // 최대 모집 인원.
	private Long memberCount; // 동아리 인원.
	private String founder; // 동아리 설립자 이름.
	private String purpose; // 동아리 설립 목적.
	private LocalDateTime createdAt; // 동아리 개설일.
	private boolean isPromoted; // 유료 홍보 여부.

	// 동아리 활동 정보.
	@Enumerated(EnumType.STRING)
	private CommunityScheduleType scheduleType = CommunityScheduleType.OCCASIONAL; // 동아리 활동 유형.
	private String scheduleDetail; // 활동 날짜 상세.
	private String address; // 기본 주소.
	private String addressDetail; // 상세 주소.

	// 동아리 게시물 정보.
	private List<String> postImages; // 첨부 이미지 목록.
	private String title; // 제목.
	private String content; // 내용.
	private String hashTags; // 한줄 가공 해시태그.

	public CommunityPostDetailDTO(Long communityId, String name, int maxMember, Long memberCount, String founder,
			String purpose, LocalDateTime createdAt, Boolean isPromoted, CommunityScheduleType scheduleType,
			String scheduleDetail, String address, String addressDetail, String title, String content,
			String hashTags) {
		this.communityId = communityId;
		this.name = name;
		this.maxMember = maxMember;
		this.memberCount = memberCount;
		this.founder = founder;
		this.purpose = purpose;
		this.createdAt = createdAt;
		this.isPromoted = isPromoted;
		this.scheduleType = scheduleType;
		this.scheduleDetail = scheduleDetail;
		this.address = address;
		this.addressDetail = addressDetail;
		this.title = title;
		this.content = content;
		this.hashTags = hashTags;
	}
}
