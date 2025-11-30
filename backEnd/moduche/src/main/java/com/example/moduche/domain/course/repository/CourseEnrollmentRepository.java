package com.example.moduche.domain.course.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.CourseEnrollment;
import com.example.moduche.domain.course.Enums.EnrollmentStatus;

public interface CourseEnrollmentRepository  extends JpaRepository<CourseEnrollment, Long> {

    /** 특정 강좌 + 세션 기준 APPROVED(수락) 된 신청 수 */
    long countByCourseAndSessionIdAndStatus(
            Course course,
            Long sessionId,
            EnrollmentStatus status
    );

    /** 같은 유저가 같은 강좌/세션/날짜에 중복 신청했는지 체크용 */
    boolean existsByCourse_CourseIdAndUser_UserIdAndSessionIdAndDate(
            Long courseId,
            Long userId,
            Long sessionId,
            LocalDate date
    );
    
    List<CourseEnrollment> findByCourse_Facility_FacilityId(Long facilityId);
    
    Page<CourseEnrollment> findByCourse_Facility_FacilityIdAndStatus(
            Long facilityId,
            EnrollmentStatus status,
            Pageable pageable
    );
}
