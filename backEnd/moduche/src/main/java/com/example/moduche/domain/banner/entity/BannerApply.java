package com.example.moduche.domain.banner.entity;

import java.time.LocalDateTime;

import com.example.moduche.domain.banner.enums.BannerApplyStatus;
import com.example.moduche.domain.login.User;
import com.example.moduche.domain.payment.entity.Payment;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "banner_apply")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BannerApply {
	// 작정자: 고은설.
	// 기능: 배너 등록 "신청" 엔티티.

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	private BannerApplyStatus status = BannerApplyStatus.APPLIED; // 배너 신청 상태.

	//1. 배너 줄력 알고리즘 구현용 컬럼 데이터.
	
	private Integer exposureCount; // 노출수(관리용).
	private Integer orderIndex;	//강제 출력 순서 (플랫폼 공지사항 배너 경우 강제 최우선 중요도 확보 필요)
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bannerType_id")
	private BannerType bannerType; // 배너 유형 정보.
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bannerExposure_id")
	private BannerDuration bannerDuration; // 노출 시간.
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bannerPriority_id")
	private BannerPriority bannerPriority; // 중요도 (높을수록 우선 노출_확장성으로 컬럼만 확보).

	private String rejectReason; // 배너 거절 사유.

	
	//2. 배너 신청자 정보 보관용 컬럼 데이터.
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "applicant_id", foreignKey = @ForeignKey(name = "banner_applicant_id"), nullable = true)
	private User applicant; // 회원시 회원 정보 저장.

	private String contact; // 광고주 연락처 (회원 아닐 경우 연락할 정보 수단 없음).
	private String ownerName; // 광고주 이름.
	
	private String password; // 비회원 확인용 암호.


	//3. 등록된 베너 신청 관련 컬럼 데이터.
	private String imageUrl; // 배너 이미지 url.

	private String redirectUrl; // 클릭 시 이동할 URL.

	private LocalDateTime appliedAt = LocalDateTime.now(); // 배너 신청 등록일.
	
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "payment_id")
	private Payment payment; // 결제 엔티티.
	

	//4. 관리자 승인 및 거절 관련 컬럼 데이터.
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "admin_id", foreignKey = @ForeignKey(name = "banner_admin_id"))
	private User admin;
	

}
