package com.example.moduche.domain.course.repository;

import com.example.moduche.global.search.CourseSearchResultDto;
import com.example.moduche.global.search.SearchRequest;



import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CourseSearchRepositoryCustom {
	 Page<CourseSearchResultDto> searchCourses(SearchRequest req);
}
