package com.example.moduche.domain.course.service;

import com.example.moduche.domain.course.Course;
import com.example.moduche.domain.course.DTO.CourseDescriptionResponse;
import com.example.moduche.domain.course.repository.CourseRepository;
import com.example.moduche.domain.tag.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseDescriptionServiceImpl implements CourseDescriptionService {

    private final CourseRepository courseRepository;
    private final TagRepository tagRepository;

    @Override
    public CourseDescriptionResponse getDescription(Long courseId) {
        Course c = courseRepository.findById(courseId)
            .orElseThrow(() -> new NoSuchElementException("Course not found: " + courseId));

        var tags = tagRepository.findTagNamesByCourseId(courseId);

        String addressLine = null;
        if (c.getFacility() != null) {
            String name = Optional.ofNullable(c.getFacility().getFacilityName()).orElse("Center");
            String addr = Optional.ofNullable(c.getFacility().getFacilityAddress()).orElse("");
            addressLine = addr.isBlank() ? name : (name + ", " + addr);
        }

        return new CourseDescriptionResponse(
            c.getTitle(),
            c.getDescription(),  // Course에 이미 LOB description 필드 있음
            tags,
            addressLine
        );
    }
}
