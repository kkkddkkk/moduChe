// 작성자: 고은설.
// 기능: 게시글 상세 페이지의 댓글 아이템 DTO.
package com.example.moduche.domain.community.dto;

import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityPostCommentDTO {
	private Long commentId; // 댓글 식별 번호.
    private Long postId;
	private String userId; // 작성자 로그인 아이디.
	private String authorName; // 작성자 이름.
	private String content; // 내용.
	private LocalDateTime createdAt; // 작성일.
}
