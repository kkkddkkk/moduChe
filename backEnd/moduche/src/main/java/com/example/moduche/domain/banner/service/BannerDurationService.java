package com.example.moduche.domain.banner.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.moduche.domain.banner.DTO.BannerDurationDTO;
import com.example.moduche.domain.banner.repository.BannerDurationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BannerDurationService {
	private final BannerDurationRepository bannerDurationRepository;

	public List<BannerDurationDTO> getAllBannerDuration() {
		return bannerDurationRepository.findAll().stream().map(entity -> BannerDurationDTO.builder().id(entity.getId())
				.days(entity.getDays()).priceMultiplier(entity.getPriceMultiplier()).build()).toList();

	}
}
