package com.example.moduche.domain.community.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.moduche.domain.community.dto.CommunityListResponseDTO;
import com.example.moduche.domain.community.dto.CommunityPostCommentDTO;
import com.example.moduche.domain.community.dto.CommunityPostDetailDTO;
import com.example.moduche.domain.community.repository.CommunityPostRepositoryCustom;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityPostService {
	
	private final CommunityPostRepositoryCustom communityRepoCustom;

	//전체 목록 조회.
	public Page<CommunityListResponseDTO> getCommunityList(Pageable pageable) {
		return communityRepoCustom.findCommunityPostSummaries(pageable);
	}
	
	//게시글 상세 조회.
	public CommunityPostDetailDTO getPostDetail(Long postId, boolean issuePreSignedUrls) {
        CommunityPostDetailDTO dto = communityRepoCustom.findPostDetail(postId, issuePreSignedUrls);
        if (dto == null) {
            throw new IllegalArgumentException("존재하지 않는 게시글입니다.");
        }
        return dto;
    }

	//해당 게시물 댓글 가져오기.
    public Page<CommunityPostCommentDTO> getComments(Long postId, Pageable pageable) {
        return communityRepoCustom.findCommentsByPost(postId, pageable);
        // 필요 시 작성자 차단 추가하기 => 과거의 내가 미래의 나에게.
    }
}
