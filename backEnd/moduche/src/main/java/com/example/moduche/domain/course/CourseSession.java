package com.example.moduche.domain.course;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.*;

@Entity @Table(name="course_session")
@Getter @Setter @NoArgsConstructor
public class CourseSession {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long sessionId;

  @ManyToOne(fetch=FetchType.LAZY, optional=false)
  @JoinColumn(name="course_id", foreignKey=@ForeignKey(name="fk_session_course"))
  private Course course;

  private LocalDateTime startAt;
  private LocalDateTime endAt;
  private LocalDate startDate;
  private LocalDate endDate;
  private String startTime;
  private String endTime;
  private String dowMask;        // e.g. 0110010
  private Integer interval;
  private Integer capacityOverride;  // nullable
}