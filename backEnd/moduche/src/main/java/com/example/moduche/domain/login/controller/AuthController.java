package com.example.moduche.domain.login.controller;

import java.time.Duration;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.moduche.domain.login.dto.ChangePwDTO;
import com.example.moduche.domain.login.dto.LoginRequestDTO;
import com.example.moduche.domain.login.dto.LoginResponseDTO;
import com.example.moduche.domain.login.dto.LogoutDTO;
import com.example.moduche.domain.login.repository.EmailVerificationRepository;
import com.example.moduche.domain.login.repository.RefreshTokenRepository;
import com.example.moduche.domain.login.service.AuthService;
import com.example.moduche.global.Response;
import com.example.moduche.global.StatusEnum;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;
	private final EmailVerificationRepository emailVerificationRepository;
	private final UserRepository userRepository;
	private final RefreshTokenRepository refreshTokenRepository;

	@PostMapping("/login") 
	public ResponseEntity<Response> login(@RequestBody LoginRequestDTO requestDTO) {
		LoginResponseDTO responseDTO = authService.login(requestDTO);
		if(!responseDTO.isAllSuccess()) //로그인 생성시 failMessage 전달
			return ResponseEntity.ok().body(new Response(StatusEnum.OK, responseDTO.getMessage(), responseDTO));
		
		//로그인 성공시 쿠키에 refresh token 전달
		ResponseCookie cookie = ResponseCookie.from("refreshToken", responseDTO.getRefreshToken())
				.httpOnly(true)
				.secure(true)
				.path("/")
				.maxAge(Duration.ofDays(14))
				.sameSite("Strict")
				.build();
		
		LoginResponseDTO returnDTO = LoginResponseDTO.builder()
				.allSuccess(true)
				.name(responseDTO.getName())
				.accessToken(responseDTO.getAccessToken())
				.message(responseDTO.getMessage())
				.build();
		
		//header에 
		 return ResponseEntity.ok()
         .header(HttpHeaders.SET_COOKIE, cookie.toString())
         .body(new Response(StatusEnum.OK, responseDTO.getMessage(), returnDTO));
	}

	@PostMapping("/reissue")
	public Response reissue( 
			@CookieValue(value = "refreshToken", required = false) String refreshToken){
		
	    if (refreshToken == null) {
	        return new Response(StatusEnum.NOT_FOUND, "Refresh Token이 없습니다.", null);
	    }
	    
	    LoginResponseDTO responseDTO = authService.reissue(refreshToken);
	    
	    return new Response(StatusEnum.OK, responseDTO.getMessage(), responseDTO.getAccessToken());
	}
	
	@PostMapping("/logout")
	public ResponseEntity<?> logout(@RequestBody LogoutDTO dto) {
	    authService.deleteToken(dto.getUsername());
	    
	    ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
	            .httpOnly(true)
	            .secure(true)
	            .path("/")
	            .maxAge(0)
	            .sameSite("Strict")
	            .build();
		refreshTokenRepository.deleteByUserName(dto.getUsername());

	    return ResponseEntity.ok()
	            .header(HttpHeaders.SET_COOKIE, cookie.toString())
	            .body(new Response(StatusEnum.OK, "로그아웃 성공", dto));
	}
	
	@PostMapping("/changePw")
	public Response changePw(@RequestBody ChangePwDTO dto){
		authService.changePw(dto.getUsername(), dto.getPassword());
		String message = "비밀번호가 변경되었습니다.";
		
		String email = userRepository.findByUserName(dto.getUsername()).get().getEmail();
	    return new Response(StatusEnum.OK, message, null);
	}
}
