package com.example.moduche.domain.community;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "communitymember")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CommunityMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = true)
    private Long userId;
    @Column(name = "community_id", nullable = false)
    private Long communityId;
    @Column(name = "member_id", nullable = false)
    private Long memberId;
    @Column(name = "role", nullable = true)
    private String role;
    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt;
}