// CourseRepository.java
package com.example.moduche.domain.course.repository;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.DTO.CourseListResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {

    
	 @EntityGraph(attributePaths={"facility","courseType","createdBy"})
	    @Query("select c from Course c where c.courseId = :id")
	    Optional<Course> findHeaderById(@Param("id") Long id);

	    // 🔹 강좌 리스트용 (생성일 내림차순)
	    Page<Course> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
