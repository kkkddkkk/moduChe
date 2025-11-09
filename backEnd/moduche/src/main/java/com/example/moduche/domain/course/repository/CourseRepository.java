// CourseRepository.java
package com.example.moduche.domain.course.repository;

import com.example.moduche.domain.course.Course;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {

    @EntityGraph(attributePaths={"facility","courseType","createdBy"})
    @Query("select c from Course c where c.courseId = :id")
    Optional<Course> findHeaderById(@Param("id") Long id);
}
