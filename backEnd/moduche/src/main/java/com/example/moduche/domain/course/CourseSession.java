package com.example.moduche.domain.course;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "coursesession")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CourseSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id", nullable = false)
    private Long courseId;
    @Column(name = "session_id", nullable = false)
    private Long sessionId;
    @Column(name = "start_at", nullable = true)
    private LocalDateTime startAt;
    @Column(name = "end_at", nullable = true)
    private LocalDateTime endAt;
    @Column(name = "start_date", nullable = true)
    private LocalDate startDate;
    @Column(name = "end_date", nullable = true)
    private LocalDate endDate;
    @Column(name = "start_time", nullable = true)
    private String startTime;
    @Column(name = "end_time", nullable = true)
    private String endTime;
    @Column(name = "dow_mask", nullable = true)
    private String dowMask;
    @Column(name = "interval", nullable = true)
    private Integer interval;
}