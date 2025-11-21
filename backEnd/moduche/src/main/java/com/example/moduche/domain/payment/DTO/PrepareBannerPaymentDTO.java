package com.example.moduche.domain.payment.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PrepareBannerPaymentDTO {
	
	private Long bannerTypeId;
	private Long bannerDurationId;
	private Long bannerPriorityId;
}
