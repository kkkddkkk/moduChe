package com.example.moduche.domain.banner.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.example.moduche.domain.banner.DTO.ApplyLookUpDTO;
import com.example.moduche.domain.banner.DTO.ApplyLookUpRequestDTO;
import com.example.moduche.domain.banner.service.BannerApplyService;
import com.example.moduche.domain.banner.service.BannerDurationService;
import com.example.moduche.domain.banner.service.BannerPriorityService;
import com.example.moduche.domain.banner.service.BannerService;
import com.example.moduche.domain.banner.service.BannerTypeService;
import com.example.moduche.domain.login.User;
import com.example.moduche.global.security.JwtTokenProvider;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class BannerApplyController {

	private final BannerTypeService bannerTypeService;
	private final BannerDurationService bannerDurationService;
	private final BannerPriorityService bannerPriorityService;

	private final BannerApplyService bannerApplyService;
	private final BannerService bannerService;

	private final JwtTokenProvider jwtTokenProvider;
	private final UserRepository userRepository;

	// 토큰에서 유저아이디 추출 유틸.
	private Long extractUserId(String authorizationHeader) {
		if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer "))
			throw new IllegalArgumentException("Authorization header required");

		String token = authorizationHeader.replace("Bearer ", "").trim();
		String username = jwtTokenProvider.getUsername(token); // username 추출.

		// username으로 userId 조회.
		Long userId = userRepository.findByUserName(username).map(User::getUserId)
				.orElseThrow(() -> new RuntimeException("User not found"));

		return userId;
	}

	@GetMapping("/api/banner/member-list")
	public ResponseEntity<List<ApplyLookUpDTO>> getMemberBannerApply(
			@RequestHeader("Authorization") String authorizationHeader) {

		Long userId = extractUserId(authorizationHeader);
	    List<ApplyLookUpDTO> list = bannerApplyService.getMemberBannerApply(userId);
	    return ResponseEntity.ok(list);
	}

	@PostMapping("/api/banner/guest-list")
	public ResponseEntity<List<ApplyLookUpDTO>> getGuestBannerApply(@RequestBody ApplyLookUpRequestDTO request) {

		List<ApplyLookUpDTO> list = bannerApplyService.getGuestBannerApply(request.getContact(),
				request.getPassword());
		return ResponseEntity.ok(list);
	}

}
