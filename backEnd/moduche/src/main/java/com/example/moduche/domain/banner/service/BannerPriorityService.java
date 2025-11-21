package com.example.moduche.domain.banner.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.moduche.domain.banner.DTO.BannerPriorityDTO;
import com.example.moduche.domain.banner.repository.BannerPriorityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BannerPriorityService {
	private final BannerPriorityRepository bannerPriorityRepository;

	public List<BannerPriorityDTO> getAllBannerPriority() {
		return bannerPriorityRepository.findAll().stream()
				.map(entity -> BannerPriorityDTO.builder().id(entity.getId()).label(entity.getLabel())
						.priorityWeight(entity.getPriorityWeight()).extraPrice(entity.getExtraPrice()).build())
				.toList();

	}
}
