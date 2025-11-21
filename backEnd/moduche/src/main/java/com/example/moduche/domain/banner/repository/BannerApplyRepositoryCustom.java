package com.example.moduche.domain.banner.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.moduche.domain.banner.DTO.BannerApplyCardDTO;
import com.example.moduche.domain.banner.enums.BannerApplyStatus;

public interface BannerApplyRepositoryCustom {
	Page<BannerApplyCardDTO> findCardsByStatus(BannerApplyStatus status, String search, Pageable pageable);
}
