package com.example.moduche.domain.enrollment;

import com.example.moduche.domain.enrollment.Enrollment;
import com.example.moduche.domain.enrollment.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    /** 코스 전체(세션무관) 현재 ENROLLED 수 */
    @Query("""
      select count(e) from Enrollment e
      where e.course.courseId = :courseId
        and e.status = com.example.moduche.domain.enrollment.EnrollmentStatus.ENROLLED
    """)
    long countCourseEnrolled(Long courseId);

    /** 특정 세션의 현재 ENROLLED 수 */
    @Query("""
      select count(e) from Enrollment e
      where e.course.courseId = :courseId
        and e.session.sessionId = :sessionId
        and e.status = com.example.moduche.domain.enrollment.EnrollmentStatus.ENROLLED
    """)
    long countSessionEnrolled(Long courseId, Long sessionId);
}
