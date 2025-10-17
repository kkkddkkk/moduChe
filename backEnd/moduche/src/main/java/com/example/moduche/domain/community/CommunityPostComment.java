package com.example.moduche.domain.community;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "communitypostcomment")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CommunityPostComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id", nullable = false)
    private Long postId;
    @Column(name = "user_id", nullable = true)
    private Long userId;
    @Column(name = "comment_id", nullable = false)
    private Long commentId;
    @Column(name = "content", nullable = true)
    private String content;
    @Column(name = "created_at", nullable = true)
    private LocalDateTime createdAt;
}