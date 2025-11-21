package com.example.moduche.domain.banner.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.moduche.domain.banner.DTO.BannerTypeDTO;
import com.example.moduche.domain.banner.entity.BannerType;
import com.example.moduche.domain.banner.repository.BannerTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BannerTypeService {
	private final BannerTypeRepository bannerTypeRepository;

	public List<BannerTypeDTO> getAllBannerType() {
		return bannerTypeRepository.findAll().stream().map(
				entity -> BannerTypeDTO.builder().id(entity.getId()).label(entity.getLabel()).basePrice(entity.getBasePrice()).build())
				.toList();

	}
}
