package com.example.moduche.domain.community.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.moduche.domain.community.dto.MemberManageDTO;
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
@RequestMapping("/api/community/{communityId}/members")
public class CommunityMemberController {

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

	// 운영자에 의한 회원 정지.
	@PutMapping("/{memberId}/suspend")
	public ResponseEntity<?> suspendMember(@PathVariable("communityId") Long communityId,
			@PathVariable("memberId") Long memberId, @RequestParam(value = "reason", required = false) String reason,
			@RequestHeader("Authorization") String authorizationHeader) {
		Long ownerId = extractUserId(authorizationHeader);
		memberService.updateStatus(communityId, memberId, ownerId, CommunityMemberStatus.SUSPENDED, reason);

		return ResponseEntity.ok("suspended");
	}

	// 회원 탈퇴, 운영자 가능.
	@PutMapping("/{memberId}/quit")
	public ResponseEntity<?> quitMemberOwner(@PathVariable("communityId") Long communityId,
			@PathVariable("memberId") Long memberId, @RequestParam(value = "reason", required = false) String reason,
			@RequestHeader("Authorization") String authorizationHeader) {
		Long ownerId = extractUserId(authorizationHeader);
		memberService.updateStatus(communityId, memberId, ownerId, CommunityMemberStatus.QUIT, reason);


		return ResponseEntity.ok("quit");

	}
	

	// 회원 활성화 (정지/탈퇴 → ACTIVE).
	@PutMapping("/{memberId}/activate")
	public ResponseEntity<?> activateMember(@PathVariable("communityId") Long communityId,
			@PathVariable("memberId") Long memberId, @RequestHeader("Authorization") String authorizationHeader) {
		Long ownerId = extractUserId(authorizationHeader);

		memberService.updateStatus(communityId, memberId, ownerId, CommunityMemberStatus.ACTIVE, null);

		return ResponseEntity.ok("activated");
	}

	
	//운영자 본인 등급 하향 조정, 타인에게 권리 전이용.
	@PostMapping("/transfer-owner")
	public ResponseEntity<?> transferOwner(
	        @RequestHeader("Authorization") String authorizationHeader,
	        @PathVariable("communityId") Long communityId,
	        @RequestParam("targetMemberId") Long targetMemberId
	) {

	    Long currentUserId = extractUserId(authorizationHeader);

	    memberService.transferOwner(communityId, currentUserId, targetMemberId);

	    return ResponseEntity.ok("대표 운영자 권한이 성공적으로 이양되었습니다.");
	}
	
	// 회원 등급 변경 (ADMIN/MANAGER/MEMBER).
	@PutMapping("/{memberId}/role")
	public ResponseEntity<?> updateRole(@PathVariable("communityId") Long communityId,
			@PathVariable("memberId") Long memberId, @RequestParam("role") CommunityMemberRole role,
			@RequestHeader("Authorization") String authorizationHeader) {
		Long ownerId = extractUserId(authorizationHeader);

		memberService.updateRole(communityId, memberId, ownerId, role);

		return ResponseEntity.ok("role updated");
	}

	// 회원 목록 조회 (상태별).
	@GetMapping
	public Page<MemberManageDTO> getMembers(@PathVariable("communityId") Long communityId,
			@RequestParam("status") CommunityMemberStatus status,
			@RequestHeader("Authorization") String authorizationHeader, Pageable pageable) {
		Long ownerId = extractUserId(authorizationHeader);

		return memberService.getMembersByStatus(communityId, ownerId, status, pageable);
	}
}
