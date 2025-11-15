package com.example.moduche.domain.community.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.moduche.domain.community.dto.CommunityListResponseDTO;
import com.example.moduche.domain.community.dto.CommunityPostCommentDTO;
import com.example.moduche.domain.community.dto.CommunityPostDetailDTO;
import com.example.moduche.domain.community.dto.PostManageDTO;
import com.example.moduche.domain.community.dto.PostUpdateRequestDTO;
import com.example.moduche.domain.community.dto.PostUpdateResponseDTO;
import com.example.moduche.domain.community.service.CommunityPostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CommunityPostController {

	private final CommunityPostService communityPostService;

	// 목록 조회.
	@GetMapping("/api/community-post/list")
	public ResponseEntity<Page<CommunityListResponseDTO>> getCommunities(
			@PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

		Page<CommunityListResponseDTO> result = communityPostService.getCommunityList(pageable);
		return ResponseEntity.ok(result);
	}

	// 해당 아이디 동아리 관련 모든 게시물 출력.
	@GetMapping("/api/community/{communityId}/posts")
	public ResponseEntity<Page<PostManageDTO>> getMyCommunityList(@PathVariable("communityId") Long communityId,

			@PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

		Page<PostManageDTO> result = communityPostService.getMyCommunityList(communityId, pageable);
		return ResponseEntity.ok(result);
	}

	// 찐 해당 게시물 수정.
	@PutMapping(value = "/api/community/{communityId}/post/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Void> updatePost(@PathVariable("communityId") Long communityId,
			@PathVariable("postId") Long postId, @RequestPart("data") PostUpdateRequestDTO dto,
			@RequestPart(value = "newImages", required = false) List<MultipartFile> newImages) {
		communityPostService.updateCommunityPost(communityId, postId, dto, newImages);
		return ResponseEntity.ok().build();
	}

	// 게시물 삭제
	@DeleteMapping("/api/community/{communityId}/post/{postId}")
	public ResponseEntity<Void> deletePost(@PathVariable("communityId") Long communityId, @PathVariable("postId") Long postId) {
		communityPostService.deleteCommunityPost(communityId, postId);
		return ResponseEntity.ok().build();
	}

	// 해당 게시물 수정위한 출력.
	@GetMapping("/api/community-post/{postId}/edit")
	public PostUpdateResponseDTO getPostUpdateInfo(@PathVariable("postId") Long postId) {
		return communityPostService.getPostUpdateInfo(postId);
	}

	// 아이디 상세 조회.
	@GetMapping("/api/community-post/{postId}")
	public CommunityPostDetailDTO getDetail(@PathVariable("postId") Long postId,
			@RequestParam(name = "withSignedUrls", defaultValue = "true") boolean withSignedUrls) {
		return communityPostService.getPostDetail(postId, withSignedUrls);
	}

	// 아이디 댓글 조회.
	@GetMapping("/api/community-post/{postId}/comments")
	public Page<CommunityPostCommentDTO> getComments(@PathVariable("postId") Long postId,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size) {
		return communityPostService.getComments(postId, PageRequest.of(page, size));
	}

}
