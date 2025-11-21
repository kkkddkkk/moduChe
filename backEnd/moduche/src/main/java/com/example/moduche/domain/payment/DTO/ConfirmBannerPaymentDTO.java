package com.example.moduche.domain.payment.DTO;

import java.math.BigDecimal;

import com.example.moduche.domain.payment.enums.PaymentStatus;

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
public class ConfirmBannerPaymentDTO {
	private Long paymentId;
	private Long bannerTypeId;
	private String method;
	private BigDecimal amount;
	private PaymentStatus status; 
}
