package com.example.moduche.global.search;

public interface CommunitySearchService {
    SearchResponse<CommunitySearchResultDto> search(SearchRequest req);
}
