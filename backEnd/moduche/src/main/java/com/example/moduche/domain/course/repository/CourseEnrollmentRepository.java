// src/main/java/com/example/moduche/domain/course/repository/CourseEnrollmentRepository.java
package com.example.moduche.domain.course.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.CourseEnrollment;
import com.example.moduche.domain.course.Enums.EnrollmentStatus;

public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {
	
	@Query("""
	        select e
	        from CourseEnrollment e
	        join fetch e.course c
	        left join fetch c.facility f
	        where e.user.userId = :userId
	        order by e.createdAt desc
	        """)
	    List<CourseEnrollment> findAllWithCourseByUser(@Param("userId") Long userId);

    /** 특정 강좌 + 세션 기준 APPROVED(수락) 된 신청 수 */
	long countByCourse_CourseIdAndSessionIdAndStatus(
	        Long courseId,
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

    /** (예전용) 전체 리스트 – 필요하면 계속 사용 가능 */
    List<CourseEnrollment> findByCourse_Facility_FacilityId(Long facilityId);

    /** ✅ 시설별 전체 수강신청(상태 무관) 페이징 */
    Page<CourseEnrollment> findByCourse_Facility_FacilityId(
            Long facilityId,
            Pageable pageable
    );

    /** (옵션) 특정 상태만 페이징으로 보고 싶을 때 */
    Page<CourseEnrollment> findByCourse_Facility_FacilityIdAndStatus(
            Long facilityId,
            EnrollmentStatus status,
            Pageable pageable
    );
    
}
