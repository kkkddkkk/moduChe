package com.example.moduche.domain.community;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "communitypost")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CommunityPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "community_id", nullable = false)
    private Long communityId;
    @Column(name = "post_id", nullable = false)
    private Long postId;
    @Column(name = "user_id", nullable = true)
    private Long userId;
    @Column(name = "title", nullable = false)
    private String title;
    @Column(name = "content", nullable = true)
    private String content;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    @Column(name = "hash_tag", nullable = true)
    private String hashTag;
}