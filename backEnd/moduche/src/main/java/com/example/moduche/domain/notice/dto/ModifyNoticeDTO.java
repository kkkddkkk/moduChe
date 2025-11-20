package com.example.moduche.domain.notice.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@ToString
public class ModifyNoticeDTO {
	
	private Long noticeId;
	
	private String username;
	private String title;// 제목
	private String content;// 내용

	private Boolean isPinned; //고정 여부
	private Boolean isVisible;//활성화 여부
	
	// 수정 시 입력받을 값
	private List<String> newPhotos; // 새로 추가된 이미지 키.
	private List<String> deletePhotos; // 삭제할 기존 이미지 키.
	
    // JPQL 생성자용
    public ModifyNoticeDTO(String createdByName, String title, String content, Boolean isPinned, Boolean isVisible) {
        this.username = createdByName;
        this.title = title;
        this.content = content;
        this.isPinned = isPinned;
        this.isVisible = isVisible;
    }

    // imgUrls는 생성자에서 제외하고 setter로 나중에 넣을 수 있음
    public void setNewPhotos(List<String> newPhotos) {
        this.newPhotos = newPhotos;
    }
    public void setDeletePhotos(List<String> deletePhotos) {
        this.deletePhotos = deletePhotos;
    }
    public void setAllPhotos(List<String> newPhotos, List<String> deletePhotos) {
        this.newPhotos = newPhotos;
        this.deletePhotos = deletePhotos;
    }
	
}
