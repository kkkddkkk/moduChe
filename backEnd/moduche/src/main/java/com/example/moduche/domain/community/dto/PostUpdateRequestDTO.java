package com.example.moduche.domain.community.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostUpdateRequestDTO {
	private String title;
	private String content;
	private String hashTags;

	// 수정 시 입력받을 값
	private List<String> newPhotos; // 새로 추가된 이미지 키.
	private List<String> deletePhotos; // 삭제할 기존 이미지 키.
}
