package com.example.moduche.domain.community.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.moduche.domain.community.dto.CommunityListResponseDTO;
import com.example.moduche.domain.community.dto.CommunityPostCommentDTO;
import com.example.moduche.domain.community.dto.CommunityPostDetailDTO;
import com.example.moduche.domain.community.service.CommunityPostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CommunityPostController {
	
	private final CommunityPostService communityPostService;

	//목록 조회.
	@GetMapping("/api/community-post/list")
	public ResponseEntity<Page<CommunityListResponseDTO>> getCommunities(
	        @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC)
	        Pageable pageable) {

	    Page<CommunityListResponseDTO> result = communityPostService.getCommunityList(pageable);
	    return ResponseEntity.ok(result);
	}
	
	//아이디 상세 조회.
	@GetMapping("/api/community-post/{postId}")
    public CommunityPostDetailDTO getDetail(
            @PathVariable("postId") Long postId,
            @RequestParam(name = "withSignedUrls", defaultValue = "true") boolean withSignedUrls) {
        return communityPostService.getPostDetail(postId, withSignedUrls);
    }

	//아이디 댓글 조회.
    @GetMapping("/api/community-post/{postId}/comments")
    public Page<CommunityPostCommentDTO> getComments(
            @PathVariable("postId") Long postId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return communityPostService.getComments(postId, PageRequest.of(page, size));
    }
	
}
