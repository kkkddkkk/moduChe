package com.example.moduche.domain.community.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.moduche.domain.community.dto.CommunityPostCommentDTO;
import com.example.moduche.domain.community.entity.CommunityPost;
import com.example.moduche.domain.community.entity.CommunityPostComment;
import com.example.moduche.domain.community.repository.CommunityCommentRepository;
import com.example.moduche.domain.community.repository.CommunityPostRepository;
import com.example.moduche.domain.community.repository.CommunityPostRepositoryCustom;
import com.example.moduche.domain.login.User;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CommunityCommentService {
	private final CommunityPostRepository communityPostRepository;
	private final CommunityCommentRepository communityCommentRepository;
	private final UserRepository userRepository;

	/** 댓글 등록 */
	public CommunityPostCommentDTO insertComment(Long postId, Long userId, String content) {
		CommunityPost post = communityPostRepository.findById(postId)
				.orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

		User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

		CommunityPostComment comment = new CommunityPostComment();
		comment.setPost(post);
		comment.setUser(user);
		comment.setContent(content);
		comment.setCreatedAt(LocalDateTime.now());

		communityCommentRepository.save(comment);

		return CommunityPostCommentDTO.builder().commentId(comment.getCommentId()).postId(post.getPostId())
				.userId(user.getUsername()).authorName(user.getName()).content(comment.getContent())
				.createdAt(comment.getCreatedAt()).build();
	}

	/** 댓글 목록 조회 */
	@Transactional(readOnly = true)
	public Page<CommunityPostCommentDTO> getCommentsByPost(Long postId, Pageable pageable) {
		CommunityPost post = communityPostRepository.findById(postId)
				.orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

		 Page<CommunityPostComment> commentPage = communityCommentRepository.findByPost(post, pageable);

		    List<CommunityPostCommentDTO> dtoList = commentPage.getContent().stream()
		            .map(c -> CommunityPostCommentDTO.builder()
		                    .commentId(c.getCommentId())
		                    .postId(c.getPost().getPostId())
		                    .userId(c.getUser().getUsername())
		                    .authorName(c.getUser().getName())
		                    .content(c.getContent())
		                    .createdAt(c.getCreatedAt())
		                    .build())
		            .toList();

		    return new PageImpl<>(dtoList, pageable, commentPage.getTotalElements());
	}

	/** 댓글 삭제 (본인만 가능) */
	public void deleteComment(Long commentId, Long userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

		CommunityPostComment comment = communityCommentRepository.findById(commentId)
				.orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

		if (!comment.getUser().getUserId().equals(userId)) {
			throw new IllegalArgumentException("본인이 작성한 댓글만 삭제할 수 있습니다.");
		}

		communityCommentRepository.delete(comment);
	}
}
