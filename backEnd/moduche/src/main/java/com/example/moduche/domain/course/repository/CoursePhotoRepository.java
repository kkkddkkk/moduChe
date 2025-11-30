package com.example.moduche.domain.course.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.moduche.domain.course.CoursePhoto;

public interface CoursePhotoRepository extends JpaRepository<CoursePhoto, Long> {

    // 개별 URL 기준 삭제
    void deleteByPhotoUrl(String photoUrl);

    // 강좌 기준 전체 삭제
    void deleteByCourse_CourseId(Long courseId);

    // 강좌 기준 전체 URL 조회 (수정/삭제 시 필요)
    @Query("SELECT p.photoUrl FROM CoursePhoto p WHERE p.course.courseId = :courseId ORDER BY p.photoId ASC")
    List<String> findPhotoUrlsByCourseId(@Param("courseId") Long courseId);

    // 일괄 삭제용 (필요하면 사용)
    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM CoursePhoto ph WHERE ph.course.courseId = :courseId")
    void bulkDeleteByCourseId(@Param("courseId") Long courseId);
}
