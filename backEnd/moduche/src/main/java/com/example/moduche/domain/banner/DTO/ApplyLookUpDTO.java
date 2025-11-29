package com.example.moduche.domain.banner.DTO;

import java.time.Duration;
import java.time.LocalDateTime;

import com.example.moduche.domain.banner.entity.BannerApply;
import com.example.moduche.global.AWS.service.AWSService;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplyLookUpDTO {
	private Long id;
    private String bannerType;
    private LocalDateTime createdAt;
    private String status;
    private String imageUrl;

    public static ApplyLookUpDTO from(BannerApply apply,  AWSService awsService) {

    	String presignedUrl = awsService.toPreSignedUrl(
                apply.getImageUrl(),
                Duration.ofMinutes(20)
        );

        return new ApplyLookUpDTO(
                apply.getId(),
                apply.getBannerType().getLabel(),
                apply.getAppliedAt(),
                apply.getStatus().name(),
                presignedUrl
        );
    }
}
