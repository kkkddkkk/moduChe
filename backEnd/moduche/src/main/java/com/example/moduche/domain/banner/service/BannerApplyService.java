package com.example.moduche.domain.banner.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.moduche.domain.banner.DTO.BannerApplyCardDTO;
import com.example.moduche.domain.banner.entity.Banner;
import com.example.moduche.domain.banner.entity.BannerApply;
import com.example.moduche.domain.banner.enums.BannerApplyStatus;
import com.example.moduche.domain.banner.enums.BannerStatus;
import com.example.moduche.domain.banner.repository.BannerApplyRepository;
import com.example.moduche.domain.banner.repository.BannerApplyRepositoryCustomImpl;
import com.example.moduche.domain.banner.repository.BannerRepository;
import com.example.moduche.domain.login.User;
import com.example.moduche.global.AWS.service.AWSService;
import com.example.moduche.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BannerApplyService {

	private final BannerApplyRepository applyRepository;
	private final BannerRepository bannerRepository;
	private final BannerApplyRepositoryCustomImpl applyRepositoryCustom;
	private final AWSService awsService;

	public Page<BannerApplyCardDTO> getPendingApplies(int page, int size, String search) {

		Pageable pageable = PageRequest.of(page, size);
		
		Page<BannerApplyCardDTO> result = applyRepositoryCustom.findCardsByStatus(BannerApplyStatus.APPLIED, search,
				pageable);
		result.forEach(dto -> {
			if (dto.getImageUrl() != null) {
				dto.setImageUrl(awsService.toPreSignedUrl(dto.getImageUrl(), Duration.ofMinutes(20)));
			}
		});

		return result;
	}

	@Transactional
	public void acceptBanner(Long bannerApplyId, User admin) {

	    //배너 신청 조회.
	    BannerApply apply = applyRepository.findById(bannerApplyId)
	            .orElseThrow(() -> new IllegalArgumentException("Banner Apply not found"));

	    //이미 승인된 경우 방지.
	    if (apply.getStatus() != BannerApplyStatus.APPLIED) {
	        throw new IllegalStateException("이미 처리된 신청입니다.");
	    }

	    //승인 처리.
	    apply.setAdmin(admin);
	    apply.setStatus(BannerApplyStatus.APPROVED);
	    apply.setAppliedAt(LocalDateTime.now());

	    //Banner 생성.
	    Banner banner = new Banner();
	    banner.setBannerApply(apply);

	    //게시 기간 BannerApply에서 설정.
	    banner.setStartDate(LocalDateTime.now());
	    banner.setEndDate(LocalDateTime.now().plusDays(
	            apply.getBannerDuration().getDays()
	    ));
	    banner.setStatus(BannerStatus.ACTIVE);

	    //저장.
	    bannerRepository.save(banner);
	}
}
