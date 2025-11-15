package com.example.moduche.domain.community.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostUpdateResponseDTO {
	private Long postId;
	private String title;
	private String content;
	private String hashTags;

	// 기존 이미지 키 목록
	private List<String> existingImages; // 그냥 키(프리사인 없이).

}
