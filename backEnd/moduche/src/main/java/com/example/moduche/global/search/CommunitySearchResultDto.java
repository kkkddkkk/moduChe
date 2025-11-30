// src/main/java/com/example/moduche/global/search/CommunitySearchResultDto.java
package com.example.moduche.global.search;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CommunitySearchResultDto {

    private Long communityId;
    private String title;
    private String summary;          // 본문 앞부분 80자 정도
    private String authorName;       // 작성자 이름 (User.name 기준 가정)
    private LocalDateTime createdAt;
    private Long viewCount;          // 없으면 null로 넘어감
    
    private String representativeImage;
}
