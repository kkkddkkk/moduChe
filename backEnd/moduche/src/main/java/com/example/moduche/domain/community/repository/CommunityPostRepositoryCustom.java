package com.example.moduche.domain.community.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.moduche.domain.community.dto.CommunityListResponseDTO;
import com.example.moduche.domain.community.dto.CommunityPostCommentDTO;
import com.example.moduche.domain.community.dto.CommunityPostDetailDTO;

public interface CommunityPostRepositoryCustom {

	// 전체 목록 조회.
	Page<CommunityListResponseDTO> findCommunityPostSummaries(Pageable pageable);

	// 상세 본문 조회.
	CommunityPostDetailDTO findPostDetail(Long postId, boolean issuePreSignedUrls);

	// 사진 키 목록 조회.
	List<String> findPhotoKeysByPostId(Long postId);

	// 댓글 페이지 조회.
	Page<CommunityPostCommentDTO> findCommentsByPost(Long postId, Pageable pageable);

}
