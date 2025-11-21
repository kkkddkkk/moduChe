package com.example.moduche.domain.community.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.moduche.domain.community.dto.CommunityRequestDTO;
import com.example.moduche.domain.community.dto.MetaInfoEditRequestDTO;
import com.example.moduche.domain.community.dto.MetaInfoViewDTO;
import com.example.moduche.domain.community.service.CommunityService;
import com.example.moduche.domain.login.User;
import com.example.moduche.global.security.JwtTokenProvider;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CommunityController {

	private final CommunityService communityService;
	private final UserRepository userRepository;
	private final JwtTokenProvider jwtTokenProvider;

	// 토큰에서 유저아이디 추출 유틸.
	private Long extractUserId(String authorizationHeader) {
		if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer "))
			throw new IllegalArgumentException("Authorization header required");

		String token = authorizationHeader.replace("Bearer ", "");
		String username = jwtTokenProvider.getUsername(token); // username 추출.

		// username으로 userId 조회.
		Long userId = userRepository.findByUserName(username).map(User::getUserId)
				.orElseThrow(() -> new RuntimeException("User not found"));

		return userId;
	}

//	@PostMapping("/api/community")
//	public ResponseEntity<?> registerCommunity(
//			@ModelAttribute CommunityRequestDTO dto,
//			@RequestPart("representativeImage") MultipartFile repImg, 
//			@RequestPart("images") List<MultipartFile> images,
//			@AuthenticationPrincipal UserDetails user) {
//		
//		communityService.registerCommunity(dto, repImg, images, user);
//		return ResponseEntity.ok("등록 완료");
//	}

	// 동아리 등록용.
	@PostMapping("/api/community")
	public ResponseEntity<?> registerCommunity(@RequestHeader("Authorization") String tokenHeader,
			@RequestPart("data") CommunityRequestDTO dto, @RequestPart("images") List<MultipartFile> images) {

		Long userId = extractUserId(tokenHeader);

		communityService.registerCommunity(userId, dto, images);
		return ResponseEntity.ok("등록 완료");
	}

	// 동아리 소유주 여부 경량 반환용.
	@GetMapping("/api/community/is-owner")
	public ResponseEntity<Boolean> checkIfOwner(@RequestHeader("Authorization") String tokenHeader) {
		Long userId = extractUserId(tokenHeader);

		boolean isOwner = communityService.hasCommunityOwnedByUser(userId);
		System.out.println("userId: " + userId);
		return ResponseEntity.ok(isOwner);
	}

	// 해당 유저 관할 모든 동아리 정보 추출.
	@GetMapping("/api/community/owner")
	public ResponseEntity<?> getMyCommunities(@RequestHeader("Authorization") String tokenHeader) {
		Long userId = extractUserId(tokenHeader);
		return ResponseEntity.ok(communityService.getCommunitiesByOwner(userId));
	}

	// 동아리 자체에 대한 개설일, 활동일자 등 메타 정보 추출.
	@GetMapping("/api/community/{communityId}/meta")
	public ResponseEntity<?> getCommunityMeta(@RequestHeader("Authorization") String tokenHeader,
			@PathVariable("communityId") Long communityId) {

		Long ownerId = extractUserId(tokenHeader);

		MetaInfoViewDTO result = communityService.getCommunityMetaInfo(communityId);
		return ResponseEntity.ok(result);
	}

	// 동아리 자체에 대한 메타 정보 수정.
	@PutMapping("/api/community/{communityId}/meta")
	public ResponseEntity<?> updateCommunityMeta(@RequestHeader("Authorization") String tokenHeader,
			@PathVariable("communityId") Long communityId, @RequestBody MetaInfoEditRequestDTO dto) {

		// 메타 정보 수정은 운영자 온리.
		Long userId = extractUserId(tokenHeader);
		communityService.updateCommunityMetaInfo(userId, communityId, dto);

		return ResponseEntity.ok("수정 완료");
	}

	@DeleteMapping("/api/community/{communityId}/delete")
	public ResponseEntity<Void> deletePost(@RequestHeader("Authorization") String tokenHeader,
			@PathVariable("communityId") Long communityId) {

		// 메타 정보 수정은 운영자 온리.
		Long userId = extractUserId(tokenHeader);
		communityService.deleteCommunity(userId, communityId);
		return ResponseEntity.ok().build();
	}

}
