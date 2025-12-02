package com.example.moduche.global.search;

public interface CourseSearchService {
    SearchResponse<CourseSearchResultDto> search(SearchRequest req);
}
