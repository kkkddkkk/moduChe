package com.example.moduche.domain.course.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.moduche.domain.course.DTO.CourseCreateRequest;
import com.example.moduche.domain.course.DTO.CourseCreateResponse;

public interface CourseCommandService {
    CourseCreateResponse registerCourse(Long ownerId, CourseCreateRequest dto, List<MultipartFile> images);
}