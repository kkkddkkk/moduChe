package com.example.moduche.domain.payment.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
public class PrepareBannerResponseDTO {

	private Long id;
	private BigDecimal amount;
	private Long bannerTypeId;

}
