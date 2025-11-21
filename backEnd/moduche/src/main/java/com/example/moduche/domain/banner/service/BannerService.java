package com.example.moduche.domain.banner.service;

import java.time.LocalDateTime;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.moduche.domain.banner.DTO.BannerApplyRequestDTO;
import com.example.moduche.domain.banner.entity.BannerApply;
import com.example.moduche.domain.banner.entity.BannerType;
import com.example.moduche.domain.banner.repository.BannerApplyRepository;
import com.example.moduche.domain.banner.repository.BannerDurationRepository;
import com.example.moduche.domain.banner.repository.BannerPriorityRepository;
import com.example.moduche.domain.banner.repository.BannerRepository;
import com.example.moduche.domain.banner.repository.BannerTypeRepository;
import com.example.moduche.domain.login.User;
import com.example.moduche.domain.payment.entity.Payment;
import com.example.moduche.domain.payment.enums.PaymentStatus;
import com.example.moduche.domain.payment.enums.PaymentTargetType;
import com.example.moduche.domain.payment.repository.PaymentRepository;
import com.example.moduche.global.AWS.service.AWSService;
import com.example.moduche.repository.UserRepository;
import com.example.moduche.domain.payment.service.PaymentService;

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

	private final UserRepository userRepository;

	private final AWSService awsService;
	private final PaymentService paymentService;

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
}
