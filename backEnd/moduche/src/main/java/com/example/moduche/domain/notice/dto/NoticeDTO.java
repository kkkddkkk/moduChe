package com.example.moduche.domain.notice.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

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
public class NoticeDTO {
	private String username;
	private String title;// 제목
	private String content;// 내용

	private Boolean isPinned; //고정 여부
	private Boolean isVisible;//활성화 여부
	
	private List<String> imgUrls;//이미지들
	
    // JPQL 생성자용
    public NoticeDTO(String createdByName, String title, String content, Boolean isPinned, Boolean isVisible) {
        this.username = createdByName;
        this.title = title;
        this.content = content;
        this.isPinned = isPinned;
        this.isVisible = isVisible;
    }

    // imgUrls는 생성자에서 제외하고 setter로 나중에 넣을 수 있음
    public void setImgUrls(List<String> imgUrls) {
        this.imgUrls = imgUrls;
    }
	
}
