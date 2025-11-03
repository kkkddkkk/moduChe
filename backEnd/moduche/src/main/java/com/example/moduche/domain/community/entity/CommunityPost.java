package com.example.moduche.domain.community.entity;

import com.example.moduche.domain.community.enums.CommunityPostStatus;
import com.example.moduche.domain.login.User;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import lombok.*;

@Entity
@Table(name = "community_post")
@Getter
@Setter
@NoArgsConstructor
public class CommunityPost {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long postId; // 1. 게시물 식별번호.

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "community_id", foreignKey = @ForeignKey(name = "fk_post_comm"))
	private Community community; // 2. 소속 동아리.

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_post_user"))
	private User user; // 3. 작성자.

	private String title; // 4. 제목.

    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    @Column(columnDefinition = "text")
	private String content; // 5. 내용.

	@Column(length = 300)
	private String hashTags; // 6. 한줄 가공 해시태그.

	@Enumerated(EnumType.STRING)
	private CommunityPostStatus status = CommunityPostStatus.REGISTERED; // 7. 관리자 승인 대기.
	
	//8. 등록일.
	private LocalDateTime createdAt = LocalDateTime.now();
}