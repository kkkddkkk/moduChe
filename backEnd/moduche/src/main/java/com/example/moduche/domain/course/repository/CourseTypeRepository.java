package com.example.moduche.domain.course.repository;

import com.example.moduche.domain.course.CourseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseTypeRepository extends JpaRepository<CourseType, String> {
}