package com.example.moduche.domain.enrollment;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "enrollment")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id", nullable = false)
    private Long courseId;
    @Column(name = "user_id", nullable = true)
    private Long userId;
    @Column(name = "enroll_id", nullable = false)
    private Long enrollId;
    @Column(name = "status", nullable = true)
    private String status;
    @Column(name = "caregiver_attend", nullable = true)
    private String caregiverAttend;
    @Column(name = "enrolled_at", nullable = true)
    private LocalDateTime enrolledAt;
}