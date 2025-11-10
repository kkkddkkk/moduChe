package com.example.moduche.domain.login.controller;

import java.util.Optional;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.moduche.domain.login.EmailVerification;
import com.example.moduche.domain.login.dto.VerifyResponseDTO;
import com.example.moduche.domain.login.enums.VerifyStatus;
import com.example.moduche.domain.login.repository.EmailVerificationRepository;
import com.example.moduche.domain.login.service.EmailService;
import com.example.moduche.global.Response;
import com.example.moduche.global.StatusEnum;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/email")
public class EmailController {

	private final EmailService emailService;
	private final EmailVerificationRepository emailVerificationRepository;

	@PostMapping("/codeTest") // 인증코드 검증
	public Response test(@RequestBody VerifyResponseDTO dto) {
		VerifyStatus status = emailService.verifyTest(dto.getEmail(), dto.getCode());
		Optional<EmailVerification> entityOp = emailVerificationRepository.findByEmail(dto.getEmail());

		if (entityOp.isEmpty()) {
			return new Response(StatusEnum.NO_CONTENT, "메일 주소 불일치", status);
		} else {
			EmailVerification entity = entityOp.get();
			entity.setVerifyStatus(status);
			emailVerificationRepository.save(entity);
		}
		return new Response(StatusEnum.OK, "인증 로직 성공", status);
	}
}
