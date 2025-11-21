package com.example.moduche.domain.banner.DTO;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import com.example.moduche.domain.banner.enums.BannerApplyStatus;
import com.querydsl.core.annotations.QueryProjection;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BannerApplyCardDTO {

	private Long id;
	
	private String bannerTypeLabel;
	private Integer durationDays;
	private String priorityLabel;
	
	private String imageUrl;
	private String redirectUrl;
	private BannerApplyStatus status;
	private LocalDateTime appliedAt;
	
	private Long paymentId;
	private BigDecimal amount;
	
	private String ownerName;
	private String contact;
	
	@QueryProjection
    public BannerApplyCardDTO(
        Long id,
        String bannerTypeLabel,
        Integer durationDays,
        String priorityLabel,
        String imageUrl,
        String redirectUrl,
        BannerApplyStatus status,
        LocalDateTime appliedAt,
        Long paymentId,
        BigDecimal amount,
        String ownerName,
        String contact
    ) {
        this.id = id;
        this.bannerTypeLabel = bannerTypeLabel;
        this.durationDays = durationDays;
        this.priorityLabel = priorityLabel;
        this.imageUrl = imageUrl;
        this.redirectUrl = redirectUrl;
        this.status = status;
        this.appliedAt = appliedAt;
        this.paymentId = paymentId;
        this.amount = amount;
        this.ownerName = ownerName;
        this.contact = contact;
    }

}
