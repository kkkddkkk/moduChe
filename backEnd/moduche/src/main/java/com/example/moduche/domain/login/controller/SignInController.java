package com.example.moduche.domain.login.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.moduche.domain.facility.dto.FacilityListForSignInDTO;
import com.example.moduche.domain.login.dto.DisabilityDTO;
import com.example.moduche.domain.login.dto.EmailTestDTO;
import com.example.moduche.domain.login.dto.FacilitySignInDTO;
import com.example.moduche.domain.login.dto.IdTestDTO;
import com.example.moduche.domain.login.dto.IndividualSignInDTO;
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

	private final EmailService emailService;
	private final SignInService signInService;
	private final EmailVerificationRepository emailVerificationRepository;

	@PostMapping("/idTest") // 아이디 중복검사
	public Response idTest(@RequestBody IdTestDTO dto) {
		boolean pass = signInService.idTest(dto.getLoginId());
		String available = "사용 가능한 ID 입니다.";
		String unavailable = "이미 사용 중인 ID 입니다.";

		return new Response(pass ? StatusEnum.OK : StatusEnum.CONFLICT, pass ? available : unavailable, null);
	}

	@PostMapping("/emailTest") // 이메일 중복검사 후 발송
	public Response sendEmail(@RequestBody EmailTestDTO dto) {
		boolean pass = signInService.emailTest(dto.getEmail());
		String available = "인증 코드가 발송되었습니다.";
		String unavailable = "이미 가입된 이메일입니다.";
		if(pass) return new Response(StatusEnum.OK, available, emailService.sendCodeToEmail(dto.getEmail()));
		else return new Response(StatusEnum.CONFLICT,unavailable, null);
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
	public Response individual(@RequestBody IndividualSignInDTO dto) throws Exception {
		Long userId = signInService.individual(dto);
		//인증코드 삭제
		emailVerificationRepository.deleteByEmail(dto.getEmail());
		return new Response(StatusEnum.OK, "회원가입 로직 성공",userId);
	}
	
	//시설 회원가입
	@PostMapping("/facility")
	public Response facility(@RequestBody FacilitySignInDTO dto) throws Exception {
		Long userId = signInService.facility(dto);
		//인증코드 삭제
		emailVerificationRepository.deleteByEmail(dto.getEmail());
		return new Response(StatusEnum.OK, "회원가입 로직 성공",userId);
	}
}
