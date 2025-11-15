package com.example.moduche.domain.community.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.moduche.domain.community.dto.CommunityListResponseDTO;
import com.example.moduche.domain.community.dto.CommunityPostCommentDTO;
import com.example.moduche.domain.community.service.CommunityCommentService;
import com.example.moduche.domain.login.User;
import com.example.moduche.global.security.JwtTokenProvider;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community/comments")
public class CommunityCommentController {

	private final CommunityCommentService communityCommentService;

	private final UserRepository userRepository;
	private final JwtTokenProvider jwtTokenProvider;

	/** 댓글 등록 */
	@PostMapping
	public ResponseEntity<CommunityPostCommentDTO> insertComment(
			@RequestHeader("Authorization") String tokenHeader,
			@RequestParam("postId") Long postId, 
			@RequestParam("content") String content) {
		
		String token = tokenHeader.replace("Bearer ", "");

		String username = jwtTokenProvider.getUsername(token); //username 추출.

		//username으로 userId 조회.
		Long userId = userRepository.findByUserName(username).map(User::getUserId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		CommunityPostCommentDTO dto = communityCommentService.insertComment(postId, userId, content);

		return ResponseEntity.ok(dto);
	}

	/** 댓글 목록 조회 */
	@GetMapping("/{postId}")
	public ResponseEntity<Page<CommunityPostCommentDTO>> getCommentsByPost(
			@PathVariable("postId") Long postId,
			@PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC)
	        Pageable pageable) {


	    Page<CommunityPostCommentDTO> comments = communityCommentService.getCommentsByPost(postId, pageable);

		return ResponseEntity.ok(comments);
	}
	

	/** 댓글 삭제 */
	@DeleteMapping("/{commentId}")
	public ResponseEntity<Void> deleteComment(
			@PathVariable("commentId") Long commentId,
			@RequestHeader("Authorization") String tokenHeader) {

		String token = tokenHeader.replace("Bearer ", "");

		String username = jwtTokenProvider.getUsername(token); //username 추출.

		//username으로 userId 조회.
		Long userId = userRepository.findByUserName(username).map(User::getUserId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		communityCommentService.deleteComment(commentId, userId);
		return ResponseEntity.noContent().build();
	}
}
