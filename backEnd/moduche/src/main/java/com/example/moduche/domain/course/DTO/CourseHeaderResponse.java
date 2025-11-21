// src/main/java/.../course/DTO/CourseHeaderResponse.java
package com.example.moduche.domain.course.DTO;

import lombok.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.example.moduche.domain.course.Course;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CourseHeaderResponse {
    private String title;
    private String bylineName;
    private String bylineOrg;

    private LocalDate periodStart;
    private LocalDate periodEnd;

    private String scheduleLine;

    private List<SessionDto> sessions;
    private Map<String, List<String>> datesBySession;

    private String defaultSessionId;
    private String defaultDate;

    private List<String> tags;

    private FacilityHeaderDto facility;

    private String thumbnailUrl;
    private Integer maxParticipants;

    private Course.CourseFormat format;
    private Course.CourseStatus status;
}
