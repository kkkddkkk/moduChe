package com.example.moduche.domain.promotion;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.moduche.domain.community.CommunityPost;
import com.example.moduche.domain.course.Course;

import lombok.*;

@Entity @Table(name="promotion")
@Getter @Setter @NoArgsConstructor
public class Promotion {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long promotionId;

  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="course_id", foreignKey=@ForeignKey(name="fk_promo_course"))
  private Course course;

  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="post_id", foreignKey=@ForeignKey(name="fk_promo_post"))
  private CommunityPost post;

  private String targetType; // COURSE/POST
  private LocalDateTime startDate;
  private LocalDateTime endDate;
  private LocalDateTime createdAt;
}