package com.example.moduche.domain.notice.dto;

import java.time.LocalDateTime;

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
public class FetchNoticeDTO {
	private Long noticeId;
	private LocalDateTime createdAt;//작성시간
	private LocalDateTime updatedAt;//수정시간
	private String title;// 제목
	private boolean isPinned; //고정 여부
	private boolean isVisible;//활성화 여부
	private int viewCount;//조회수
	private String createdByName;//작성자 이름
}
