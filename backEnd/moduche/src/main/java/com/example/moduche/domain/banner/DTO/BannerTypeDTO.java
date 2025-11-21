package com.example.moduche.domain.banner.DTO;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class BannerTypeDTO {
	private Long id;
	private String label; // 배너 유형 (상단/사이드/메인)
	private BigDecimal basePrice; // 혓식에 따른 배너 "기본금".
}
