package com.example.moduche.domain.community.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.moduche.domain.community.dto.CommunityRequestDTO;
import com.example.moduche.domain.community.dto.MyCommunityDTO;
import com.example.moduche.domain.community.entity.Community;
import com.example.moduche.domain.community.entity.CommunityMember;
import com.example.moduche.domain.community.entity.CommunityPost;
import com.example.moduche.domain.community.entity.CommunityPostPhoto;
import com.example.moduche.domain.community.enums.CommunityMemberRole;
import com.example.moduche.domain.community.enums.CommunityMemberStatus;
import com.example.moduche.domain.community.enums.CommunityPostStatus;
import com.example.moduche.domain.community.enums.CommunityStatus;
import com.example.moduche.domain.community.repository.CommunityMemberRepository;
import com.example.moduche.domain.community.repository.CommunityPostPhotoRepository;
import com.example.moduche.domain.community.repository.CommunityPostRepository;
import com.example.moduche.domain.community.repository.CommunityRepository;
import com.example.moduche.domain.login.User;
import com.example.moduche.global.AWS.service.AWSService;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityService {

	private final AWSService awsService;

	private final CommunityRepository communityRepository;
	private final CommunityPostRepository postRepository;
	private final CommunityPostPhotoRepository photoRepository;
	private final CommunityMemberRepository memberRepository;
	private final UserRepository userRepository;

//	public void registerCommunity(
//			CommunityRequestDTO dto, 
//			MultipartFile repImg, 
//			List<MultipartFile> images,
//			UserDetails user) {
//		
//		// 1. 대표 이미지 업로드
//		String repUrl = awsService.upload(repImg);
//
//		// 2. Community 저장
//		Community community = new Community();
//		community.setName(dto.getName());
//		community.setFounder(dto.getFounder());
//		community.setPurpose(dto.getPurpose());
//		community.setMaxMember(dto.getMaxMember());
//		community.setScheduleType(dto.getScheduleType());
//		community.setScheduleDetail(dto.getScheduleDetail());
//		community.setAddress(dto.getAddress());
//		community.setAddressDetail(dto.getAddressDetail());
//		community.setRepresentativeImage(repUrl);
//		community.setOwner((User) user);
//		community.setStatus(CommunityStatus.REGISTERED);
//		//community.setCreatedAt(LocalDateTime.now()); => 기본 생성으로 변경.
//		communityRepository.save(community);
//
//		// 3. 게시물 저장
//		CommunityPost post = new CommunityPost();
//		post.setCommunity(community);
//		post.setUser((User) user);
//		post.setTitle(dto.getTitle());
//		post.setContent(dto.getContent());
//		post.setHashTags(dto.getHashTags());
//		post.setStatus(CommunityPostStatus.REGISTERED);
//		//post.setCreatedAt(LocalDateTime.now()); => 기본 생성으로 변경.
//		postRepository.save(post);
//
//		// 4. 이미지 저장
//		for (MultipartFile image : images) {
//			String url = awsService.upload(image);
//			CommunityPostPhoto photo = new CommunityPostPhoto();
//			photo.setPost(post);
//			photo.setPhotoUrl(url);
//			photoRepository.save(photo);
//		}
//
//		// 5. 리더 등록
//		CommunityMember member = new CommunityMember();
//		member.setCommunity(community);
//		member.setUser((User) user);
//		member.setRole(CommunityMemberRole.ADMIN);
//		member.setJoinedAt(LocalDateTime.now());
//		memberRepository.save(member);
//
//	}

	public void registerCommunity(Long ownerId, CommunityRequestDTO dto, List<MultipartFile> images) {

		// 1. 유저 조회.
		User owner = userRepository.findById(ownerId)
				.orElseThrow(() -> new IllegalArgumentException("테스트 유저를 찾을 수 없습니다."));

		// 2. Community 저장
		Community community = new Community();
		community.setName(dto.getName());
		community.setPurpose(dto.getPurpose());
		community.setMaxMember(dto.getMaxMember());
		community.setScheduleType(dto.getScheduleType());
		community.setScheduleDetail(dto.getScheduleDetail());
		community.setAddress(dto.getAddress());
		community.setAddressDetail(dto.getAddressDetail());
		community.setOwner(owner);
		community.setFounder(owner.getName());
		community.setRepresentativeImage(null);
		community.setStatus(CommunityStatus.REGISTERED);
		communityRepository.save(community);

		// 3. 게시물 저장
		CommunityPost post = new CommunityPost();
		post.setCommunity(community);
		post.setUser(owner);
		post.setTitle(dto.getTitle());
		post.setContent(dto.getContent());
		post.setHashTags(dto.getHashTags());
		post.setStatus(CommunityPostStatus.REGISTERED);
		postRepository.save(post);


		// 4. 이미지는 AWS 업로드 후 저장
	    for (MultipartFile file : images) {
	        String url = awsService.upload(file, "community/post");
	        CommunityPostPhoto photo = new CommunityPostPhoto();
	        photo.setPost(post);
	        photo.setPhotoUrl(url);
	        photoRepository.save(photo);
	    }
		// 5. 리더 등록
		CommunityMember member = new CommunityMember();
		member.setCommunity(community);
		member.setUser(owner);
		member.setRole(CommunityMemberRole.ADMIN);
		member.setStatus(CommunityMemberStatus.ACTIVE);
		member.setJoinedAt(LocalDateTime.now());
		memberRepository.save(member);

	}

	@Transactional(readOnly = true)
	public boolean hasCommunityOwnedByUser(Long userId) {
		return communityRepository.existsByOwner_UserId(userId);
	}

	//운영자가 소유한 모든 동아리 목록 반환.
	public List<MyCommunityDTO> getCommunitiesByOwner(Long ownerId) {
	    return communityRepository.findByOwner_UserId(ownerId)
	            .stream()
	            .map(c -> new MyCommunityDTO(c.getCommunityId(), c.getName(), c.getRepresentativeImage(), c.getCreatedAt()))
	            .toList();
	}
}
