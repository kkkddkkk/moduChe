package com.example.moduche.domain.promotion;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "promotion")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_Id", nullable = false)
    private Long promotionId;
    @Column(name = "course_id", nullable = false)
    private Long courseId;
    @Column(name = "post_id", nullable = false)
    private Long postId;
    @Column(name = "target_type", nullable = true)
    private String targetType;
    @Column(name = "start_date", nullable = true)
    private LocalDateTime startDate;
    @Column(name = "end_date", nullable = true)
    private LocalDateTime endDate;
    @Column(name = "created_at", nullable = true)
    private LocalDateTime createdAt;
}