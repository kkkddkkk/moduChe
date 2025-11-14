// CourseHeaderResponse.java
package com.example.moduche.domain.course.DTO;

import com.example.moduche.domain.course.Course;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record CourseHeaderResponse(
    String title,
    String bylineName,
    String bylineOrg,

    LocalDate periodStart,
    LocalDate periodEnd,
    String scheduleLine,

    List<SessionDto> sessions,
    Map<String, List<String>> datesBySession,

    String defaultSessionId,
    String defaultDate,

    List<String> tags,
    FacilityHeaderDto facility,

    String thumbnailUrl,
    Integer maxParticipants,
    Course.CourseFormat format,
    Course.CourseStatus status
) {}
