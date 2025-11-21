package com.example.moduche.domain.payment.controller;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.moduche.domain.payment.DTO.ConfirmBannerPaymentDTO;
import com.example.moduche.domain.payment.DTO.PrepareBannerPaymentDTO;
import com.example.moduche.domain.payment.DTO.PrepareBannerResponseDTO;
import com.example.moduche.domain.payment.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class PaymentController {

	private final PaymentService paymentService;
	
	@PostMapping("/api/payment/prepare-banner")
	public PrepareBannerResponseDTO preparePayment(@RequestBody PrepareBannerPaymentDTO dto) {
		
		PrepareBannerResponseDTO prepared = paymentService.prepareBannerPayment(dto);
		return prepared;
	}
	
	@PostMapping("/api/payment/confirm-banner")
	public Long confirmPayment(@RequestBody ConfirmBannerPaymentDTO dto) {
		
		Long donePaymentId = paymentService.confirmBannerPayment(dto);
		return donePaymentId;
	}
	
	
}
