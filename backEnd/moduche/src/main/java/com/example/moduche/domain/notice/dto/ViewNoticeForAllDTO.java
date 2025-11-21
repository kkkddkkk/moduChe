package com.example.moduche.domain.notice.dto;

import java.time.LocalDateTime;
import java.util.List;

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
public class ViewNoticeForAllDTO {
	private Long noticeId;
	private String title;// 제목
	private Boolean isPinned; //고정 여부
	private String createdByName;//작성자 이름
	private LocalDateTime createdAt;//작성시간
	private int viewCount;//조회수
	private String content;//내용

	private List<String> imgUrls;//이미지들
	private Long prevId;
	private Long nextId;
	
	public ViewNoticeForAllDTO(Long noticeId, String title, Boolean isPinned, String createdByName, 
			LocalDateTime createdAt, int viewCount, String content) {
		this.noticeId = noticeId;
		this.title = title;
		this.isPinned = isPinned;
		this.createdByName = createdByName;
		this.createdAt = createdAt;
		this.viewCount = viewCount;
		this.content = content;
	}



}
