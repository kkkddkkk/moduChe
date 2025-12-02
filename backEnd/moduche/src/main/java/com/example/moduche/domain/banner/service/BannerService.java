package com.example.moduche.domain.banner.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.moduche.domain.banner.DTO.BannerApplyRequestDTO;
import com.example.moduche.domain.banner.DTO.BannerOnPrintCardDTO;
import com.example.moduche.domain.banner.DTO.MainBannerListDTO;
import com.example.moduche.domain.banner.entity.Banner;
import com.example.moduche.domain.banner.entity.BannerApply;
import com.example.moduche.domain.banner.entity.BannerPriority;
import com.example.moduche.domain.banner.entity.BannerType;
import com.example.moduche.domain.banner.enums.BannerApplyStatus;
import com.example.moduche.domain.banner.enums.BannerStatus;
import com.example.moduche.domain.banner.repository.BannerApplyRepository;
import com.example.moduche.domain.banner.repository.BannerDurationRepository;
import com.example.moduche.domain.banner.repository.BannerPriorityRepository;
import com.example.moduche.domain.banner.repository.BannerRepository;
import com.example.moduche.domain.banner.repository.BannerRepositoryCustomImpl;
import com.example.moduche.domain.banner.repository.BannerTypeRepository;
import com.example.moduche.domain.banner.utility.BannerScore;
import com.example.moduche.domain.login.User;
import com.example.moduche.domain.payment.entity.Payment;
import com.example.moduche.domain.payment.repository.PaymentRepository;
import com.example.moduche.domain.payment.service.PaymentService;
import com.example.moduche.global.AWS.service.AWSService;
import com.example.moduche.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BannerService {

	private final BannerRepository bannerRepository;
	private final BannerApplyRepository bannerApplyRepository;
	private final BannerDurationRepository bannerDurationRepository;
	private final BannerPriorityRepository bannerPriorityRepository;
	private final BannerTypeRepository bannerTypeRepository;
	private final PaymentRepository paymentRepository;
	private final BannerRepositoryCustomImpl bannerRepositoryCustomImpl;

	private final UserRepository userRepository;

	private final AWSService awsService;
	private final PaymentService paymentService;
//	private final RedisTemplate<String, Integer> redisTemplate;

	private final String DEFAULT_MAIN_BANNER_PREFIX = "banners/main-banners/sample_banner_";
	private final String DEFAULT_HEADER_BANNER = "banners/header-banners/sample_banner.png";
	private final String DEFAULT_SIDE_BANNER = "banners/side-banners/sample_banner.png";

	public void createBannerApply(BannerApplyRequestDTO request, MultipartFile bannerImage) {

		// 미지 업로드, S3 URL 획득.
		String imageUrl = awsService.upload(bannerImage, getBannerFolderName(request.getBannerTypeId()));

		// BannerApply 생성.
		BannerApply apply = new BannerApply();
		apply.setOwnerName(request.getOwnerName());
		apply.setContact(request.getContact());
		apply.setRedirectUrl(request.getRedirectUrl());
		apply.setBannerType(bannerTypeRepository.getReferenceById(request.getBannerTypeId()));
		apply.setBannerDuration(bannerDurationRepository.getReferenceById(request.getBannerDurationId()));
		apply.setBannerPriority(bannerPriorityRepository.getReferenceById(request.getBannerPriorityId()));
		apply.setImageUrl(imageUrl);

		// 회원/비회원 분기.
		if (request.isMemberApply()) {
			User user = userRepository.findByUserName(request.getApplicantLoginId())
					.orElseThrow(() -> new IllegalArgumentException("Invalid User ID"));

			apply.setApplicant(user);
		} else {
			apply.setPassword(request.getGuestPassword());
		}

		// BannerApply 저장.
		BannerApply saved = bannerApplyRepository.save(apply);

		// Payment 조회 생성된 Banner Apply 연결.
		Payment payment = paymentRepository.findById(request.getPaymentId())
				.orElseThrow(() -> new IllegalArgumentException("Invalid payment ID"));
		payment.setTargetId(saved.getId()); // 핵심: 결제 대상 연결
		paymentRepository.save(payment);

		// BannerApply와 Payment 연결.
		saved.setPayment(payment);
		bannerApplyRepository.save(saved);
	}

	private String getBannerFolderName(Long bannerTypeId) {

		BannerType type = bannerTypeRepository.findById(bannerTypeId)
				.orElseThrow(() -> new IllegalArgumentException("Invalid banner type ID"));

		String label = type.getLabel().toUpperCase(Locale.ROOT);

		return switch (label) {
		case "MAIN" -> "banners/main-banners";
		case "SIDE" -> "banners/side-banners";
		case "TOP" -> "banners/header-banners";
		default -> "banners/etc-banners"; // 혹시 모르는 기타 배너 백업용.
		};
	}

	// 작성자: 고은설.
	// 기능: 중요도에 따른 가점 내림차순 배너 3개 반환.
	public List<MainBannerListDTO> getMainBanners() {

		LocalDateTime now = LocalDateTime.now();

		// 유효한 배너 추출본.
		List<Banner> validBanners = bannerRepository.findValidBanners(now, BannerStatus.ACTIVE,
				BannerApplyStatus.APPROVED, "MAIN");

		System.out.print("validBanners: " + validBanners);
		System.out.print("now: " + now);

		// 유효한 배너 -> 점수 환산, 상위 3개 추출.
		List<BannerScore> scored = validBanners.stream().map(b -> {
			BannerApply apply = b.getBannerApply();
			BannerPriority priority = apply.getBannerPriority();

			double baseWeight = priority != null ? priority.getPriorityWeight() : 1;

			double orderScore = apply.getOrderIndex() != null ? (100 - apply.getOrderIndex()) : 0;

			// 노출 수 반영.
//			Integer exposureRedis = redisTemplate.opsForValue().get("banner:exposure:" + apply.getId());

//			int exposureTotal = (apply.getExposureCount() != null ? apply.getExposureCount() : 0)
//					+ (exposureRedis != null ? exposureRedis : 0);

//			double exposurePenalty = exposureTotal * 0.1;

			// 비정형 요인 추가.
			double randomFactor = Math.random() * 3;

//			double finalScore = (baseWeight * 2) + orderScore - exposurePenalty + randomFactor;
			double finalScore = (baseWeight * 2) + orderScore  + randomFactor;


			String imageUrl = awsService.toPreSignedUrl(apply.getImageUrl(), Duration.ofMinutes(20));
			String redirectUrl = apply.getRedirectUrl();

			return new BannerScore(b, finalScore, imageUrl, redirectUrl);
		}).sorted(Comparator.comparingDouble(BannerScore::getScore).reversed()).limit(3).toList();

		// banner:exposure:라는 키로 노출 수 증가 저장.
		for (BannerScore bs : scored) {
			Long applyId = bs.getBanner().getBannerApply().getId();
//			redisTemplate.opsForValue().increment("banner:exposure:" + applyId);
		}

		// 제출 DTO 리스트.
		List<MainBannerListDTO> finalBanners = scored.stream()
				.map(bs -> new MainBannerListDTO(bs.getImageUrl(), bs.getRedirectUrl()))
				.collect(Collectors.toCollection(ArrayList::new));

		// 부족하면 기본 배너 채우기.
		int need = 3 - finalBanners.size();

		for (int i = 0; i < need; i++) {
			String defaultImageKey = DEFAULT_MAIN_BANNER_PREFIX + i + ".png";
			String defaultImageUrl = awsService.toPreSignedUrl(defaultImageKey, Duration.ofMinutes(20));
			finalBanners.add(new MainBannerListDTO(defaultImageUrl, "/banner/apply"));
		}

		return finalBanners;
	}

	// 작성자: 고은설.
	// 기능: 단일 상단 배너 반환.
	public MainBannerListDTO getSingleBanner(String bannerType) {

		LocalDateTime now = LocalDateTime.now();

		// 설정이 없으면 예외.
		if (!bannerType.equals("HEADER") && !bannerType.equals("SIDE")) {
			throw new IllegalArgumentException("Unknown banner type: " + bannerType);
		}

		// 유효한 배너 조회
		List<Banner> validBanners = bannerRepository.findValidBanners(now, BannerStatus.ACTIVE,
				BannerApplyStatus.APPROVED, bannerType);

		// 유효 배너 없으면 DEFAULT 반환.
		if (validBanners.isEmpty()) {
			String defaultUrl = awsService.toPreSignedUrl(getDefaultImgKey(bannerType), Duration.ofMinutes(20));
			return new MainBannerListDTO(defaultUrl, "/banner/apply");
		}

		// 점수 계산, 최고 점수 1개 선택.
		Optional<BannerScore> selected = validBanners.stream().map(b -> {

			BannerApply apply = b.getBannerApply();
			BannerPriority priority = apply.getBannerPriority();

			double baseWeight = (priority != null ? priority.getPriorityWeight() : 1);
			double orderScore = apply.getOrderIndex() != null ? (100 - apply.getOrderIndex()) : 0;

//			Integer exposureRedis = redisTemplate.opsForValue().get("banner:exposure:" + apply.getId());
//			int exposureTotal = (apply.getExposureCount() != null ? apply.getExposureCount() : 0)
//					+ (exposureRedis != null ? exposureRedis : 0);

//			double exposurePenalty = exposureTotal * 0.1;
			double randomFactor = Math.random() * 3;

//			double finalScore = (baseWeight * 2) + orderScore - exposurePenalty + randomFactor;
			double finalScore = (baseWeight * 2) + orderScore + randomFactor;

			String imageUrl = awsService.toPreSignedUrl(apply.getImageUrl(), Duration.ofMinutes(20));
			String redirectUrl = apply.getRedirectUrl();

			return new BannerScore(b, finalScore, imageUrl, redirectUrl);

		}).max(Comparator.comparingDouble(BannerScore::getScore));

		// 선택된 배너가 있다면 Redis 노출 증가 후 반환.
		if (selected.isPresent()) {
			BannerScore bs = selected.get();

			Long applyId = bs.getBanner().getBannerApply().getId();
//			redisTemplate.opsForValue().increment("banner:exposure:" + applyId);

			return new MainBannerListDTO(bs.getImageUrl(), bs.getRedirectUrl());
		}

		// fallback.
		String fallbackUrl = awsService.toPreSignedUrl(getDefaultImgKey(bannerType), Duration.ofMinutes(20));
		return new MainBannerListDTO(fallbackUrl, "/banner/apply");
	}

	private String getDefaultImgKey(String type) {

		if (type.equals("HEADER")) {
			return DEFAULT_HEADER_BANNER;
		} else {
			return DEFAULT_SIDE_BANNER;
		}
	}

	// 작성자: 고은설.
	// 기능: 관리자용 현재 출력중인 배너 목록 출력.
	public Page<BannerOnPrintCardDTO> getBannerOnList(int page, int size, String type, String status, String search) {
		Pageable pageable = PageRequest.of(page, size);
		Page<BannerOnPrintCardDTO> result = bannerRepositoryCustomImpl.findBannerOnList(type, status, search, pageable);
		result.forEach(dto -> {
			if (dto.getImageUrl() != null) {
				dto.setImageUrl(awsService.toPreSignedUrl(dto.getImageUrl(), Duration.ofMinutes(20)));
			}
		});

		return result;
	}

	// 작성자: 고은설.
	// 기능: 관리자에 의한 배너 강제 내림 처리.
	@Transactional
	public void forceExpire(Long bannerId) {
		Banner banner = bannerRepository.findById(bannerId)
				.orElseThrow(() -> new IllegalArgumentException("Banner not found"));

		banner.setStatus(BannerStatus.EXPIRED);
		banner.setEndDate(LocalDateTime.now());
	}
}
