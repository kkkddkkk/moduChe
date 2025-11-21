package com.example.moduche.domain.community.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityNewPostDTO {
	private List<String> postImages; // 첨부 이미지 목록.
	private String title; // 제목.
	private String content; // 내용.
	private String hashTags; // 한줄 가공 해시태그.
}
