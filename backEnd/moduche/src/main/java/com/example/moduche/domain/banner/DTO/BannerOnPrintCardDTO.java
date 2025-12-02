package com.example.moduche.domain.banner.DTO;

import java.time.LocalDateTime;

import com.querydsl.core.annotations.QueryProjection;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BannerOnPrintCardDTO {

	private Long id;

	private String bannerTypeLabel;
	private Integer durationDays;
	private String priorityLabel;

	private String imageUrl;
	private String redirectUrl;

	private LocalDateTime startDate;// 게시 시작일.
	private LocalDateTime endDate;// 게시 종료일.

	private String ownerName;
	private String contact;

	@QueryProjection
    public BannerOnPrintCardDTO(
            Long id,
            String bannerTypeLabel,
            Integer durationDays,
            String priorityLabel,
            String imageUrl,
            String redirectUrl,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String ownerName,
            String contact
    ) {
        this.id = id;
        this.bannerTypeLabel = bannerTypeLabel;
        this.durationDays = durationDays;
        this.priorityLabel = priorityLabel;
        this.imageUrl = imageUrl;
        this.redirectUrl = redirectUrl;
        this.startDate = startDate;
        this.endDate = endDate;
        this.ownerName = ownerName;
        this.contact = contact;
    }
}
