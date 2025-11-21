package com.example.moduche.domain.banner.entity;

import java.time.LocalDateTime;

import com.example.moduche.domain.banner.enums.BannerStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "banner")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Banner {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "banner_apply_id", nullable = false)
	private BannerApply bannerApply; // 생성 기반이된 배너 신청 내역.

	private LocalDateTime startDate;// 게시 시작일.

	private LocalDateTime endDate;// 게시 종료일.

	@Enumerated(EnumType.STRING)
	private BannerStatus status;// 현재 상태 (게시중 / 종료됨).
}
