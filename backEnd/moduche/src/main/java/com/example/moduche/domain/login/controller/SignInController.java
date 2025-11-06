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
import com.example.moduche.domain.login.dto.IdTestDTO;
import com.example.moduche.domain.login.dto.IndividualSignInDTO;
import com.example.moduche.domain.login.dto.VerifyRequestDTO;
import com.example.moduche.domain.login.dto.VerifyResponseDTO;
import com.example.moduche.domain.login.enums.VerifyStatus;
import com.example.moduche.domain.login.repository.EmailVerificationRepository;
import com.example.moduche.domain.login.service.EmailService;
import com.example.moduche.domain.login.service.SignInService;
import com.example.moduche.global.Response;
import com.example.moduche.global.StatusEnum;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/signIn")
public class SignInController {

	private final EmailVerificationRepository emailVerificationRepository;
	private final EmailService emailService;
	private final SignInService signInService;

	@PostMapping("/idTest") // 아이디 중복검사
	public Response idTest(@RequestBody IdTestDTO dto) {
		boolean pass = signInService.idTest(dto.getLoginId());
		String available = "사용 가능한 ID 입니다.";
		String unavailable = "이미 사용 중인 ID 입니다.";

		return new Response(pass ? StatusEnum.OK : StatusEnum.CONFLICT, pass ? available : unavailable, null);
	}

	@PostMapping("/emailTest") // 이메일 발송
	public Response sendEmail(@RequestBody EmailTestDTO dto) {
		boolean pass = signInService.emailTest(dto.getEmail());
		String available = "인증 코드가 발송되었습니다.";
		String unavailable = "이미 가입된 이메일입니다.";
		if(pass) return new Response(StatusEnum.OK, available, signInService.sendCodeToEmail(dto.getEmail()));
		else return new Response(StatusEnum.CONFLICT,unavailable, null);
	}

	@PostMapping("/test") // 인증코드 검증
	public Response test(@RequestBody VerifyResponseDTO dto) {
		VerifyStatus status = signInService.verifyTest(dto.getEmail(), dto.getCode());
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
	
	@GetMapping("/getFacilityList")
	public Response getFacilityList(@RequestParam("search") String search) {
		List<FacilityListForSignInDTO> list = signInService.facilityListForSignIn(search);
		
		return new Response(StatusEnum.OK, "기관 리스트 가져옴.", list);
	}
	
	@GetMapping("/getDisabilityList")
	public Response getDisabilityList(@RequestParam("search") String search) {
		List<DisabilityDTO> list = signInService.disabilityListForSignInd(search);
		
		return new Response(StatusEnum.OK, "기관 리스트 가져옴.", list);
	}
	
	//개인 회원가입
	@PostMapping("/individual")
	public Response individual(@RequestBody IndividualSignInDTO dto) {
		
		return new Response(StatusEnum.OK, "회원가입 로직 성공",null);
	}
	
	//시설 회원가입
	@PostMapping("/facility")
	public Response facility(@RequestBody FacilitySignInDTO dto) throws Exception {
		Long userId = signInService.facility(dto);
		return new Response(StatusEnum.OK, "회원가입 로직 성공",userId);
	}
}
