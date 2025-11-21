package com.example.moduche.domain.community.service;

import java.time.Duration;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.moduche.domain.community.dto.CommunityListResponseDTO;
import com.example.moduche.domain.community.dto.CommunityNewPostDTO;
import com.example.moduche.domain.community.dto.CommunityPostCommentDTO;
import com.example.moduche.domain.community.dto.CommunityPostDetailDTO;
import com.example.moduche.domain.community.dto.PostManageDTO;
import com.example.moduche.domain.community.dto.PostUpdateRequestDTO;
import com.example.moduche.domain.community.dto.PostUpdateResponseDTO;
import com.example.moduche.domain.community.entity.Community;
import com.example.moduche.domain.community.entity.CommunityPost;
import com.example.moduche.domain.community.entity.CommunityPostPhoto;
import com.example.moduche.domain.community.enums.CommunityPostStatus;
import com.example.moduche.domain.community.repository.CommunityPostPhotoRepository;
import com.example.moduche.domain.community.repository.CommunityPostRepository;
import com.example.moduche.domain.community.repository.CommunityPostRepositoryCustom;
import com.example.moduche.domain.community.repository.CommunityRepository;
import com.example.moduche.domain.login.User;
import com.example.moduche.global.AWS.service.AWSService;
import com.example.moduche.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityPostService {

	// 복잡기능용 레포지토리(JPA레페지토리 상속 안 받은 100%수동 구현).
	private final CommunityPostRepositoryCustom communityRepoCustom;
	private final CommunityPostRepository communityPostRepository;
	private final CommunityPostPhotoRepository communityPostPhotoRepository;
	private final CommunityRepository communityRepository;
	private final UserRepository userRepository;
	private final AWSService awsService;

	// 전체 목록 조회.
	public Page<CommunityListResponseDTO> getCommunityList(Pageable pageable) {
		return communityRepoCustom.findCommunityPostSummaries(pageable);
	}

	// 해당 커뮤니티 관련 게시물 목록 조회.
	public Page<PostManageDTO> getMyCommunityList(Long communityId, Pageable pageable) {
		return communityRepoCustom.findAllCommunityPosts(communityId, pageable);
	}

	// 게시글 상세 조회.
	public CommunityPostDetailDTO getPostDetail(Long postId, boolean issuePreSignedUrls) {
		CommunityPostDetailDTO dto = communityRepoCustom.findPostDetail(postId, issuePreSignedUrls);
		if (dto == null) {
			throw new IllegalArgumentException("존재하지 않는 게시글입니다.");
		}
		return dto;
	}

	// 해당 게시물 댓글 가져오기.
	public Page<CommunityPostCommentDTO> getComments(Long postId, Pageable pageable) {
		return communityRepoCustom.findCommentsByPost(postId, pageable);
		// 필요 시 작성자 차단 추가하기 => 과거의 내가 미래의 나에게.
	}

	public PostUpdateResponseDTO getPostUpdateInfo(Long postId) {
		CommunityPost post = communityPostRepository.findById(postId)
				.orElseThrow(() -> new IllegalArgumentException("게시물 없음"));

		// 기존 이미지 키 목록
		List<String> keys = communityRepoCustom.findPhotoKeysByPostId(postId);

		// pre-signed URL 발급
		List<String> urls = keys.stream().map(k -> awsService.toPreSignedUrl(k, Duration.ofMinutes(20))).toList();

		return new PostUpdateResponseDTO(post.getPostId(), post.getTitle(), post.getContent(), post.getHashTags(),
				urls);
	}

	@Transactional
	public void registerCommunityPost(Long communityId, Long userId, CommunityNewPostDTO dto, List<MultipartFile> images) {

		Community community = communityRepository.findById(communityId)
				.orElseThrow(() -> new IllegalArgumentException("해당 아이디에 해당하는 동아리 없음: " + communityId));

		User owner = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("해당 아이디에 해당하는 유저 없음: " + userId));

		//게시물 엔티티 저장.
		CommunityPost post = new CommunityPost();
		post.setCommunity(community);
		post.setUser(owner);
		post.setTitle(dto.getTitle());
		post.setContent(dto.getContent());
		post.setHashTags(dto.getHashTags());
		post.setStatus(CommunityPostStatus.REGISTERED);
		communityPostRepository.save(post);
		
		//사진 AWS 버킷 저장 후 사진 엔티티 저장.
		for (MultipartFile file : images) {
			String url = awsService.upload(file, "community/post");
			CommunityPostPhoto photo = new CommunityPostPhoto();
			photo.setPost(post);
			photo.setPhotoUrl(url);
			communityPostPhotoRepository.save(photo);
		}
	}

	@Transactional
	public void updateCommunityPost(Long communityId, Long postId, PostUpdateRequestDTO dto,
			List<MultipartFile> newImages) {
		CommunityPost post = communityPostRepository.findById(postId)
				.orElseThrow(() -> new IllegalArgumentException("게시물 없음"));

		// 1) 텍스트 수정
		post.setTitle(dto.getTitle());
		post.setContent(dto.getContent());
		post.setHashTags(dto.getHashTags());

		// 2) 삭제 이미지 처리
		if (dto.getDeletePhotos() != null) {
			for (String key : dto.getDeletePhotos()) {
				awsService.deletePhoto(key);
				communityPostPhotoRepository.deleteByPhotoUrl(key);
			}
		}

		// 3) 새 이미지 업로드 처리
		if (newImages != null && !newImages.isEmpty()) {
			for (MultipartFile file : newImages) {
				String key = awsService.upload(file, "community/post");
				CommunityPostPhoto photo = CommunityPostPhoto.builder().post(post).photoUrl(key).build();
				communityPostPhotoRepository.save(photo);
			}
		}
	}

	// 해당 게시물 삭제.
	@Transactional
	public void deleteCommunityPost(Long communityId, Long postId) {

		CommunityPost post = communityPostRepository.findById(postId)
				.orElseThrow(() -> new IllegalArgumentException("게시물 없음"));

		// 1. 댓글 삭제
		communityRepoCustom.deleteCommentsByPostId(postId);

		// 2. 사진 키 조회
		List<String> keys = communityRepoCustom.findPhotoKeysByPostId(postId);

		// 3. S3 삭제
		keys.forEach(awsService::deletePhoto);

		// 4. 사진 DB 삭제
		communityPostPhotoRepository.deleteByPost_PostId(postId);

		// 5. 게시물 삭제
		communityPostRepository.delete(post);
	}
}
