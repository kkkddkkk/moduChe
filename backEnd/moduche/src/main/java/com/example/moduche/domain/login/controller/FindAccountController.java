package com.example.moduche.domain.login.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.moduche.domain.facility.dto.FacilityListForSignInDTO;
import com.example.moduche.domain.login.EmailVerification;
import com.example.moduche.domain.login.dto.DisabilityDTO;
import com.example.moduche.domain.login.dto.EmailTestDTO;
import com.example.moduche.domain.login.dto.FacilitySignInDTO;
import com.example.moduche.domain.login.dto.FindIdDTO;
import com.example.moduche.domain.login.dto.FindPwDTO;
import com.example.moduche.domain.login.dto.IdTestDTO;
import com.example.moduche.domain.login.dto.IndividualSignInDTO;
import com.example.moduche.domain.login.dto.VerifyRequestDTO;
import com.example.moduche.domain.login.dto.VerifyResponseDTO;
import com.example.moduche.domain.login.enums.VerifyStatus;
import com.example.moduche.domain.login.repository.EmailVerificationRepository;
import com.example.moduche.domain.login.service.EmailService;
import com.example.moduche.domain.login.service.FindAccountService;
import com.example.moduche.domain.login.service.SignInService;
import com.example.moduche.global.Response;
import com.example.moduche.global.StatusEnum;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/find")
public class FindAccountController {

	private final EmailVerificationRepository emailVerificationRepository;
	private final FindAccountService findAccountService;
	private final EmailService emailService;
	private final SignInService signInService;

	@PostMapping("/id") // id 있는지 인증 후 이메일 보내기
	public Response findId(@RequestBody FindIdDTO dto) {
		boolean pass = findAccountService.isThereId(dto.getEmail());
		String available = "인증 코드가 발송되었습니다.";
		String unavailable = "가입되지 않은 이메일입니다.";
		if (pass)
			return new Response(StatusEnum.OK, available, emailService.sendCodeToEmail(dto.getEmail()));
		else
			return new Response(StatusEnum.CONFLICT, unavailable, null);
	}

	@PostMapping("/pw") // id와 이메일이 일치하는지 검 후 이메일 보내기
	public Response findPw(@RequestBody FindPwDTO dto) {
		String available = "인증 코드가 발송되었습니다.";
		String unavailable = "ID 혹은 이메일을 다시 확인해주세요.";
		String noId = "ID가 존재하지 않습니다.";
		
		boolean isThereId = findAccountService.isThereId(dto.getEmail());
		if(!isThereId) return new Response(StatusEnum.CONFLICT, noId, null);
		
		boolean isIdAvailable = findAccountService.isIdAvailable(dto.getUsername(), dto.getEmail());
		if(!isIdAvailable) return new Response(StatusEnum.CONFLICT, unavailable, null);
		
		return new Response(StatusEnum.OK, available, emailService.sendCodeToEmail(dto.getEmail()));
	}

}
