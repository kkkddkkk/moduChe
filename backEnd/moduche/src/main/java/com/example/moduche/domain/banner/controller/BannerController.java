package com.example.moduche.domain.banner.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.moduche.domain.banner.DTO.BannerApplyCardDTO;
import com.example.moduche.domain.banner.DTO.BannerApplyRequestDTO;
import com.example.moduche.domain.banner.DTO.BannerDurationDTO;
import com.example.moduche.domain.banner.DTO.BannerOnPrintCardDTO;
import com.example.moduche.domain.banner.DTO.BannerPriorityDTO;
import com.example.moduche.domain.banner.DTO.BannerTypeDTO;
import com.example.moduche.domain.banner.DTO.MainBannerListDTO;
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
public class BannerController {

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

	@GetMapping("/api/banner/types")
	public ResponseEntity<List<BannerTypeDTO>> getBannerDisplayType() {
		List<BannerTypeDTO> result = bannerTypeService.getAllBannerType();

		return ResponseEntity.ok(result);
	}

	@GetMapping("/api/banner/durations")
	public ResponseEntity<List<BannerDurationDTO>> getBannerDurationType() {
		List<BannerDurationDTO> result = bannerDurationService.getAllBannerDuration();

		return ResponseEntity.ok(result);
	}

	@GetMapping("/api/banner/priorities")
	public ResponseEntity<List<BannerPriorityDTO>> getBannerPriorityType() {
		List<BannerPriorityDTO> result = bannerPriorityService.getAllBannerPriority();

		return ResponseEntity.ok(result);
	}

	@PostMapping(value = "/api/banner/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Void> applyBanner(@RequestPart("data") BannerApplyRequestDTO request,
			@RequestPart("images") MultipartFile bannerImage) {

		bannerService.createBannerApply(request, bannerImage);
		return ResponseEntity.ok().build();
	}

	@PutMapping("/api/banner-apply/{bannerApplyId}/accept")
	public ResponseEntity<?> acceptBannerApply(@PathVariable("bannerApplyId") Long bannerApplyId,
			@RequestHeader("Authorization") String authorizationHeader) {

		try {
			Long adminId = extractUserId(authorizationHeader);
			User admin = userRepository.findById(adminId)
					.orElseThrow(() -> new IllegalArgumentException("User not found"));

			String token = authorizationHeader.replace("Bearer ", "").trim();
			String role = jwtTokenProvider.getRole(token);

			if (!role.contains("ADMIN")) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자만 승인할 수 있습니다.");
			}

			bannerApplyService.acceptBanner(bannerApplyId, admin);
			return ResponseEntity.ok("accepted");

		} catch (IllegalArgumentException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류: " + e.getMessage());
		}
	}
	
	@PutMapping("/api/banner-apply/{bannerApplyId}/decline")
	public ResponseEntity<?> declineBannerApply(@PathVariable("bannerApplyId") Long bannerApplyId,
			@RequestHeader("Authorization") String authorizationHeader,
			@RequestParam(value = "rejectReason") String rejectReason) {

		try {
			Long adminId = extractUserId(authorizationHeader);
			User admin = userRepository.findById(adminId)
					.orElseThrow(() -> new IllegalArgumentException("User not found"));

			String token = authorizationHeader.replace("Bearer ", "").trim();
			String role = jwtTokenProvider.getRole(token);

			if (!role.contains("ADMIN")) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자만 거절할 수 있습니다.");
			}

			bannerApplyService.declineBanner(bannerApplyId, admin, rejectReason);
			return ResponseEntity.ok("declined");

		} catch (IllegalArgumentException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류: " + e.getMessage());
		}
	}

	@GetMapping("/api/banner/apply-list")
	public ResponseEntity<?> getApplyList(@RequestHeader("Authorization") String authorizationHeader,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "10") int size,
			@RequestParam(value = "search", required = false, defaultValue = "") String search,
			@RequestParam(value = "type", required = false, defaultValue = "") String bannerType) {

		try {
			Long userId = extractUserId(authorizationHeader);
			User user = userRepository.findById(userId)
					.orElseThrow(() -> new IllegalArgumentException("User not found"));

			String token = authorizationHeader.replace("Bearer ", "").trim();
			String role = jwtTokenProvider.getRole(token);

			if (!role.contains("ADMIN")) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자만 조회할 수 있습니다.");
			}

			Page<BannerApplyCardDTO> result = bannerApplyService.getPendingApplies(page, size, search, bannerType);

			return ResponseEntity.ok(result);

		} catch (IllegalArgumentException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류: " + e.getMessage());
		}
	}
	
	//현재 출력중인 배너 관리.
	@GetMapping("/api/banner/on-list")
	public ResponseEntity<?> getPrintBannerList(
	        @RequestHeader("Authorization") String authorizationHeader,
	        @RequestParam(value = "page", defaultValue = "0") int page,
	        @RequestParam(value = "size", defaultValue = "10") int size,
	        @RequestParam(value = "type", defaultValue = "ALL") String type,
	        @RequestParam(value = "status", defaultValue = "ALL") String status,
	        @RequestParam(value = "search", defaultValue = "") String search
	) {
	    try {
	        Long adminId = extractUserId(authorizationHeader);
	        User admin = userRepository.findById(adminId)
	                .orElseThrow(() -> new IllegalArgumentException("User not found"));

	        // 권한 체크
	        String token = authorizationHeader.replace("Bearer ", "").trim();
	        String role = jwtTokenProvider.getRole(token);
	        if (!role.contains("ADMIN")) {
	            return ResponseEntity.status(HttpStatus.FORBIDDEN)
	                    .body("관리자만 조회할 수 있습니다.");
	        }

	        Page<BannerOnPrintCardDTO> result =
	                bannerService.getBannerOnList(page, size, type, status, search);

	        return ResponseEntity.ok(result);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("서버 오류: " + e.getMessage());
	    }
	}
	
	//작성자: 고은설.
	//기능: 강제 만료 처리 => 관리자 온리.
	@PutMapping("/api/banner/{id}/expire")
	public ResponseEntity<?> forceExpire(
	        @PathVariable("id")  Long id,
	        @RequestHeader("Authorization") String authorizationHeader
	) {
	    try {
	        String token = authorizationHeader.replace("Bearer ", "").trim();
	        String role = jwtTokenProvider.getRole(token);
	        if (!role.contains("ADMIN")) {
	            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자 권한 필요");
	        }

	        bannerService.forceExpire(id);
	        return ResponseEntity.ok("expired");

	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("서버 오류: " + e.getMessage());
	    }
	}
	

	// 작성자: 고은설.
	// 기능: 메인배너 3개 리턴.
	@GetMapping("/api/banner/show-main")
	public ResponseEntity<List<MainBannerListDTO>> getMainBanners() {
		List<MainBannerListDTO> result = bannerService.getMainBanners();
		return ResponseEntity.ok(result);
	}

	// 작성자: 고은설.
	// 기능: 단일 사이드 배너 리턴.
	@GetMapping("/api/banner/show-side")
	public ResponseEntity<MainBannerListDTO> getSideBanner() {
		MainBannerListDTO result = bannerService.getSingleBanner("SIDE");
		return ResponseEntity.ok(result);
	}

	// 작성자: 고은설.
	// 기능: 단일 상단 배너 리턴.
	@GetMapping("/api/banner/show-header")
	public ResponseEntity<MainBannerListDTO> getHeaderBanner() {
		MainBannerListDTO result = bannerService.getSingleBanner("HEADER");
		return ResponseEntity.ok(result);
	}

}
