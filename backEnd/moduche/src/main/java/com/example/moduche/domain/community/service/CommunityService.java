package com.example.moduche.domain.community.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.moduche.domain.community.dto.CommunityRequestDTO;
import com.example.moduche.domain.community.entity.Community;
import com.example.moduche.domain.community.entity.CommunityMember;
import com.example.moduche.domain.community.entity.CommunityPost;
import com.example.moduche.domain.community.entity.CommunityPostPhoto;
import com.example.moduche.domain.community.enums.CommunityMemberRole;
import com.example.moduche.domain.community.enums.CommunityPostStatus;
import com.example.moduche.domain.community.enums.CommunityStatus;
import com.example.moduche.domain.community.repository.CommunityMemberRepository;
import com.example.moduche.domain.community.repository.CommunityPostPhotoRepository;
import com.example.moduche.domain.community.repository.CommunityPostRepository;
import com.example.moduche.domain.community.repository.CommunityRepository;
import com.example.moduche.domain.community.repository.UserRepository;
import com.example.moduche.domain.login.User;
import com.example.moduche.global.AWS.service.AWSService;

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

	public void registerCommunity(CommunityRequestDTO dto, MultipartFile repImg, List<MultipartFile> images) {

		// 0. 테스트용 유저 조회 (임시 user_id=1)
		User testUser = userRepository.findById(1L)
				.orElseThrow(() -> new IllegalArgumentException("테스트 유저를 찾을 수 없습니다."));

		// 1. 대표 이미지 업로드
		String repUrl = awsService.upload(repImg, "community/post");

		// 2. Community 저장
		Community community = new Community();
		community.setName(dto.getName());
		community.setFounder(dto.getFounder());
		community.setPurpose(dto.getPurpose());
		community.setMaxMember(dto.getMaxMember());
		community.setScheduleType(dto.getScheduleType());
		community.setScheduleDetail(dto.getScheduleDetail());
		community.setAddress(dto.getAddress());
		community.setAddressDetail(dto.getAddressDetail());
		community.setOwner(testUser);
		community.setRepresentativeImage(repUrl);
		community.setStatus(CommunityStatus.REGISTERED);
		communityRepository.save(community);

		// 3. 게시물 저장
		CommunityPost post = new CommunityPost();
		post.setCommunity(community);
		post.setUser(testUser);
		post.setTitle(dto.getTitle());
		post.setContent(dto.getContent());
		post.setHashTags(dto.getHashTags());
		post.setStatus(CommunityPostStatus.REGISTERED);
		postRepository.save(post);

		// 4-1. 대표 이미지도 photo 테이블에 저장 (AWS 재업로드 X)
		CommunityPostPhoto repPhoto = new CommunityPostPhoto();
		repPhoto.setPost(post);
		repPhoto.setPhotoUrl(repUrl);
		photoRepository.save(repPhoto);

		// 4-2. 나머지 이미지는 AWS 업로드 후 저장
		for (MultipartFile image : images) {
		    // 대표 이미지와 파일명이 같으면 건너뛴다.
		    if (image.getOriginalFilename().equals(repImg.getOriginalFilename())) continue;

		    String url = awsService.upload(image, "community/post");
		    CommunityPostPhoto photo = new CommunityPostPhoto();
		    photo.setPost(post);
		    photo.setPhotoUrl(url);
		    photoRepository.save(photo);
		}

		// 5. 리더 등록
		CommunityMember member = new CommunityMember();
		member.setCommunity(community);
		member.setUser(testUser);
		member.setRole(CommunityMemberRole.ADMIN);
		member.setJoinedAt(LocalDateTime.now());
		memberRepository.save(member);

	}

}
