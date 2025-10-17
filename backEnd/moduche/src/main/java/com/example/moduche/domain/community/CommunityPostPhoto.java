package com.example.moduche.domain.community;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "communitypostphoto")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CommunityPostPhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id", nullable = false)
    private Long postId;
    @Column(name = "photo_id", nullable = false)
    private Long photoId;
    @Column(name = "photo_url", nullable = true)
    private String photoUrl;
}