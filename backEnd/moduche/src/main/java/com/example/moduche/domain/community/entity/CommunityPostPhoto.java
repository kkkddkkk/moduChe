package com.example.moduche.domain.community.entity;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "community_post_photo")
@Getter
@Setter
@NoArgsConstructor
public class CommunityPostPhoto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long photoId; //1. 사진 고유 식별 번호.

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "post_id", foreignKey = @ForeignKey(name = "fk_photo_post"))
	private CommunityPost post; //2. 소속 게시물.

	private String photoUrl;	//3. 이미지 경로.
}