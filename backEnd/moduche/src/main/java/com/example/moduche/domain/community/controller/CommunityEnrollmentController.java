package com.example.moduche.domain.community.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.moduche.domain.community.dto.CommunityEnrollmentRequestDTO;
import com.example.moduche.domain.community.dto.EnrollmentManageDTO;
import com.example.moduche.domain.community.enums.CommunityEnrollmentStatus;
import com.example.moduche.domain.community.service.CommunityEnrollmentService;
import com.example.moduche.domain.login.User;
import com.example.moduche.global.security.JwtTokenProvider;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community/{communityId}/enrollments")
public class CommunityEnrollmentController {

	private final CommunityEnrollmentService enrollmentService;

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

	// 동아리 가입 신청서 제출.
	@PostMapping
	public ResponseEntity<?> submitEnrollment(@PathVariable("communityId") Long communityId,
			@RequestHeader("Authorization") String authorizationHeader,
			@RequestBody CommunityEnrollmentRequestDTO request) {
		Long userId = extractUserId(authorizationHeader);

		Long enrollmentId = enrollmentService.createEnrollment(userId, communityId, request);

		return ResponseEntity.ok(enrollmentId);
	}

	// 신청서 목록 조회 (상태 기반).
	@GetMapping
	public Page<EnrollmentManageDTO> getEnrollments(@PathVariable("communityId") Long communityId,
			@RequestHeader("Authorization") String authorizationHeader,
			@RequestParam("status") CommunityEnrollmentStatus status, Pageable pageable) {
		Long userId = extractUserId(authorizationHeader);

		return enrollmentService.getEnrollmentsByStatus(communityId, userId, status, pageable);
	}

	//신청서 승인.
	@PostMapping("/{enrollmentId}/approve")
	public ResponseEntity<?> approveEnrollment(@PathVariable("communityId") Long communityId,
			@PathVariable("enrollmentId") Long enrollmentId,
			@RequestHeader("Authorization") String authorizationHeader) {
		Long ownerId = extractUserId(authorizationHeader);

		enrollmentService.approveEnrollment(enrollmentId, ownerId);

		return ResponseEntity.ok("approved");
	}

	//신청서 거절.
	@PostMapping("/{enrollmentId}/deny")
	public ResponseEntity<?> denyEnrollment(@PathVariable("communityId") Long communityId,
			@PathVariable("enrollmentId") Long enrollmentId, @RequestHeader("Authorization") String authorizationHeader,
			@RequestParam("reason") String reason) {
		Long ownerId = extractUserId(authorizationHeader);

		enrollmentService.denyEnrollment(enrollmentId, ownerId, reason);

		return ResponseEntity.ok("denied");
	}

}
