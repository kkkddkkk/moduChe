package com.example.moduche.domain.community.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MyCommunityDTO {
	//작성자: 고은설.
	//기능: 운영자를 위한 본인 관할 모든 동아리 조회시 프론트 전달용.
    private Long communityId;
    private String name;
    private String representativeImage; // 동아리 썸네일.
    private LocalDateTime createdAt; // 동아리 개설일.
}