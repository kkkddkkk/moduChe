package com.example.moduche.global.search;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class SearchRequest {

    private BoardType boardType;     // COURSE / COMMUNITY

    private String keyword;          // 제목/본문/시설명/작성자 등

    private List<String> tags;       // "#필라테스" → "필라테스" 로 정제해서 보낼 것 추천

    private String location;         // 시설 주소 / 동호회 지역

    private LocalDate startDate;     // 강좌: 운영기간 / 동호회: 작성일
    private LocalDate endDate;

    private Boolean onlyUpcoming;    // 강좌: 향후 진행 예정만

    private String sortBy;           // LATEST / POPULAR / CLOSEST 등

    // 페이지네이션 (단순 버전)
    private int page = 0;
    private int size = 20;
}
