package com.example.moduche.domain.community;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "community")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Community {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "community_id", nullable = false)
    private Long communityId;
    @Column(name = "title", nullable = false)
    private String title;
    @Column(name = "description", nullable = true)
    private String description;
    @Column(name = "owner_user_id", nullable = false)
    private Long ownerUserId;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}