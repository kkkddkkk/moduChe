package com.example.moduche.domain.banner.DTO;

import java.math.BigDecimal;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class BannerPriorityDTO {
	private Long id;
	private String label;
	private Integer priorityWeight;
	private BigDecimal extraPrice;
}
