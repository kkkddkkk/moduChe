package com.example.moduche.domain.banner.DTO;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class BannerDurationDTO {
	private Long id;
	private Integer days;
	private BigDecimal priceMultiplier;
}
