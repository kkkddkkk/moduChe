package com.example.moduche.domain.community.dto;

import java.time.LocalDateTime;

import com.example.moduche.domain.community.enums.CommunityPostStatus;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PostManageDTO {
	
	//작성자: 고은설.
	//기능: 운영자를 위한 동아리 게시물 목록 조회, 수정용.
	
	//CP추출 데이터.
	private Long postId;
    private String title;
    private String content;
    private String hashTags;
    private CommunityPostStatus status;
    
    private LocalDateTime createdAt; 
    private String ownerName;   
    
}
