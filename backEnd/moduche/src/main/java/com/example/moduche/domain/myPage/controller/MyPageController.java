package com.example.moduche.domain.myPage.controller;

import java.time.Duration;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.moduche.domain.facility.repository.FacilityUserRepository;
import com.example.moduche.domain.login.dto.ChangePwDTO;
import com.example.moduche.domain.login.dto.EmailTestDTO;
import com.example.moduche.domain.login.dto.IdTestDTO;
import com.example.moduche.domain.login.dto.LoginRequestDTO;
import com.example.moduche.domain.login.dto.LoginResponseDTO;
import com.example.moduche.domain.login.dto.LogoutDTO;
import com.example.moduche.domain.login.repository.EmailVerificationRepository;
import com.example.moduche.domain.login.repository.RefreshTokenRepository;
import com.example.moduche.domain.login.service.AuthService;
import com.example.moduche.domain.login.service.EmailService;
import com.example.moduche.domain.login.service.SignInService;
import com.example.moduche.domain.myPage.dto.MyAccountResponseDTO;
import com.example.moduche.domain.myPage.dto.MyDisabilityDTO;
import com.example.moduche.domain.myPage.dto.MyFacilityDTO;
import com.example.moduche.domain.myPage.dto.UpdateAccountRequestDTO;
import com.example.moduche.domain.myPage.service.MyPageService;
import com.example.moduche.global.Response;
import com.example.moduche.global.StatusEnum;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/myPage")
public class MyPageController {

	private final AuthService authService;
	private final EmailVerificationRepository emailVerificationRepository;
	private final UserRepository userRepository;
	private final RefreshTokenRepository refreshTokenRepository;
	private final MyPageService myPageService;
	private final SignInService signInService;
	private final EmailService emailService;
	private final FacilityUserRepository facilityUserRepository;

	@PostMapping("/checkPassword") 
	public Response checkPassword(@RequestBody LoginRequestDTO dto) {
		boolean checked = myPageService.matchPassword(dto.getLoginId(), dto.getPassword());
		
		//header에 
		 return new Response(StatusEnum.OK, "", checked);
	}
	
	@PostMapping("/emailTest") // 이메일 중복검사 후 발송
	public Response sendEmail(@RequestBody EmailTestDTO dto) {
		boolean pass = signInService.emailTest(dto.getEmail());
		String available = "인증 코드가 발송되었습니다.";
		String unavailable = "이미 가입된 이메일입니다.";
		if(pass) return new Response(StatusEnum.OK, available, emailService.sendCodeToEmail(dto.getEmail()));
		else return new Response(StatusEnum.CONFLICT,unavailable, null);
	}
	
	@GetMapping("/getAccount") 
	public Response getAccount(@RequestParam("username") String username) {
		MyAccountResponseDTO responseDTO = myPageService.getAccount(username);
		
		 return new Response(StatusEnum.OK, username+"의 개인정보입니다.", responseDTO);
	}
	
	@PutMapping("/setAccount") 
	public Response setAccount(@RequestBody UpdateAccountRequestDTO requestDTO) {
		myPageService.setAccount(requestDTO);
		
		 return new Response(StatusEnum.OK, "계정 정보가 변경되었습니다.", null);
	}
	
	@GetMapping("/getDisability") 
	public Response getDisability(@RequestParam("username") String username) throws Exception {
		MyDisabilityDTO dto = myPageService.getDisability(username);
		
		 return new Response(StatusEnum.OK, username+"의 개인정보입니다.", dto);
	}
	
	@PutMapping("/setDisability") 
	public Response setDisability(@RequestBody MyDisabilityDTO dto) throws Exception {
		myPageService.setDisability(dto);
		
		 return new Response(StatusEnum.OK, "계정 정보가 변경되었습니다.", null);
	}
	
	@GetMapping("/getFacility") 
	public Response getFacility(@RequestParam("username") String username) throws Exception  {
		MyFacilityDTO dto = myPageService.getFacility(username);
		
		 return new Response(StatusEnum.OK, username+"의 시설정보입니다.", dto);
	}
	
	@PutMapping("/setFacility") 
	public Response setFacility(@RequestBody MyFacilityDTO dto) throws Exception {
		myPageService.setFacility(dto);
		
		 return new Response(StatusEnum.OK, "계정 정보가 변경되었습니다.", null);
	}

}
