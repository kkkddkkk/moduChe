package com.example.moduche.domain.payment.entity;

import java.time.LocalDateTime;
import java.math.BigDecimal;

import com.example.moduche.domain.payment.enums.PaymentStatus;
import com.example.moduche.domain.payment.enums.PaymentTargetType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;	

	@Enumerated(EnumType.STRING)
	private PaymentTargetType targetType; //결제 대상 종류.
	private Long targetId; //결제 대상의 식별자(배너면 배너 기본키, 게시물이면 게시물 기본키 연결).
	
	private BigDecimal amount; //사용자 결제금액.
	private BigDecimal fee; //PG사 수수료 제외 플랫폼 순 이익.

	private String pgTid; //PG사 거래 고유 번호.
	private String method;//결제 수단.
	@Enumerated(EnumType.STRING)
	private PaymentStatus status; //결제 상태.

	private LocalDateTime requestedAt; //결제 시도 시간.
	private LocalDateTime paidAt;	//결제 성공 시간.
	private LocalDateTime canceledAt; //환불 처리 시간.
}
