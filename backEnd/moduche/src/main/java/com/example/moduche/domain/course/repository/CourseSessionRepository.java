
package com.example.moduche.domain.course.repository;

import com.example.moduche.domain.course.CourseSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseSessionRepository extends JpaRepository<CourseSession, Long> {
    List<CourseSession> findByCourse_CourseIdOrderByStartDateAsc(Long courseId);
}
