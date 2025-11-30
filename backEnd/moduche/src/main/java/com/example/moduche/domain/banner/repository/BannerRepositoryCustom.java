package com.example.moduche.domain.banner.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.moduche.domain.banner.DTO.BannerOnPrintCardDTO;

public interface BannerRepositoryCustom {

	Page<BannerOnPrintCardDTO> findBannerOnList(String type, String status, String search, Pageable pageable);

}
