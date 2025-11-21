package com.example.moduche.domain.payment.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.example.moduche.domain.payment.repository.PaymentRepository;
import com.example.moduche.domain.banner.entity.BannerType;
import com.example.moduche.domain.banner.entity.BannerDuration;
import com.example.moduche.domain.banner.entity.BannerPriority;

import com.example.moduche.domain.banner.repository.BannerDurationRepository;
import com.example.moduche.domain.banner.repository.BannerPriorityRepository;
import com.example.moduche.domain.banner.repository.BannerTypeRepository;
import com.example.moduche.domain.payment.DTO.ConfirmBannerPaymentDTO;
import com.example.moduche.domain.payment.DTO.PrepareBannerPaymentDTO;
import com.example.moduche.domain.payment.DTO.PrepareBannerResponseDTO;
import com.example.moduche.domain.payment.entity.Payment;
import com.example.moduche.domain.payment.enums.PaymentStatus;
import com.example.moduche.domain.payment.enums.PaymentTargetType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {
	private final PaymentRepository paymentRepository;

	private final BannerTypeRepository bannerTypeRepository;
	private final BannerDurationRepository bannerDurationRepository;
	private final BannerPriorityRepository bannerPriorityRepository;

	public PrepareBannerResponseDTO prepareBannerPayment(PrepareBannerPaymentDTO dto) {

		Payment payment = new Payment();
		BigDecimal amount = getBannerCost(dto.getBannerTypeId(), dto.getBannerDurationId(), dto.getBannerPriorityId());

		payment.setAmount(amount);
		payment.setTargetType(getBannerTargetType(dto.getBannerTypeId()));
		payment.setRequestedAt(LocalDateTime.now());
		payment.setStatus(PaymentStatus.PENDING);

		paymentRepository.save(payment);

		PrepareBannerResponseDTO result = PrepareBannerResponseDTO.builder().amount(amount).id(payment.getId()).bannerTypeId(dto.getBannerTypeId()).build();

		return result;

	}

	private BigDecimal getBannerCost(Long typeId, Long durationId, Long priorityId) {

		BannerType type = bannerTypeRepository.findById(typeId)
				.orElseThrow(() -> new IllegalArgumentException("Invalid banner type ID"));

		BannerDuration duration = bannerDurationRepository.findById(durationId)
				.orElseThrow(() -> new IllegalArgumentException("Invalid banner duration ID"));

		BannerPriority priority = bannerPriorityRepository.findById(priorityId)
				.orElseThrow(() -> new IllegalArgumentException("Invalid banner priority ID"));

		BigDecimal base = type.getBasePrice();
		BigDecimal multiplier = duration.getPriceMultiplier();
		BigDecimal extra = priority.getExtraPrice();

		BigDecimal cost = base.multiply(multiplier);

		// 소수점이 생길 수 있으므로 반올림 처리.
		cost = cost.setScale(0, RoundingMode.HALF_UP);
		cost = cost.add(extra);// 우선순위 추가분 반영.
		// cost.longValue();

		return cost;
	}

	public PaymentTargetType getBannerTargetType(Long bannerTypeId) {

		BannerType type = bannerTypeRepository.findById(bannerTypeId)
				.orElseThrow(() -> new IllegalArgumentException("Invalid banner type ID"));

		String label = type.getLabel().toUpperCase(Locale.ROOT);

		return switch (label) {
		case "MAIN" -> PaymentTargetType.BANNER_MAIN;
		case "SIDE" -> PaymentTargetType.BANNER_SIDE;
		case "TOP" -> PaymentTargetType.BANNER_HEADER;
		default -> PaymentTargetType.ETC;
		};
	}

	public Long confirmBannerPayment(ConfirmBannerPaymentDTO dto) {

		Payment payment = paymentRepository.findById(dto.getPaymentId())
				.orElseThrow(() -> new IllegalArgumentException("Invalid payment ID"));

		// Payment 업데이트.
		payment.setStatus(PaymentStatus.PAID);
		payment.setMethod(dto.getMethod());
		payment.setPaidAt(LocalDateTime.now());
		payment.setTargetType(getBannerTargetType(dto.getBannerTypeId()));
		paymentRepository.save(payment);
		
		return payment.getId();
	}
}
