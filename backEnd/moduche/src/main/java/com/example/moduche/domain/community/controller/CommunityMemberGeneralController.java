package com.example.moduche.domain.community.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.moduche.domain.community.dto.MemberManageDTO;
import com.example.moduche.domain.community.dto.MyCommunityManageDTO;
import com.example.moduche.domain.community.entity.CommunityMember;
import com.example.moduche.domain.community.enums.CommunityMemberRole;
import com.example.moduche.domain.community.enums.CommunityMemberStatus;
import com.example.moduche.domain.community.service.CommunityMemberService;
import com.example.moduche.domain.login.User;
import com.example.moduche.global.security.JwtTokenProvider;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community-member")
public class CommunityMemberGeneralController {

	private final CommunityMemberService memberService;
	private final JwtTokenProvider jwtTokenProvider;
	private final UserRepository userRepository;

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

	// 동아리 소유주 여부 경량 반환용.
	@GetMapping("/is-member")
	public ResponseEntity<Boolean> checkIfMember(@RequestHeader("Authorization") String tokenHeader) {
		Long userId = extractUserId(tokenHeader);

		boolean isMember = memberService.hasCommunityAsMember(userId);
		return ResponseEntity.ok(isMember);
	}

	@GetMapping("/my-community")
	public ResponseEntity<?> getMyCommunityList(@RequestHeader("Authorization") String authorizationHeader,
			@RequestParam(value = "activeOnly", defaultValue = "true") boolean activeOnly, 
			@RequestParam(value = "search",required = false) String search,
			Pageable pageable) {

		Long userId = extractUserId(authorizationHeader);

		Page<MyCommunityManageDTO> result = memberService.getUserCommunityList(userId, activeOnly, search, pageable);

		return ResponseEntity.ok(result);
	}

	// 회원 탈퇴, 본인만 가능.
	@PutMapping("/{communityId}/quit")
	public ResponseEntity<?> quitMemberSelf(@PathVariable("communityId") Long communityId,
			@RequestParam(value = "reason", required = false) String reason,
			@RequestHeader("Authorization") String authorizationHeader) {
		System.out.println("uitMemberSelf() 진입함 communityId=" + communityId);
		Long userId = extractUserId(authorizationHeader);
		memberService.quitCommunity(communityId, userId, reason);

		return ResponseEntity.ok("quit");

	}

}
