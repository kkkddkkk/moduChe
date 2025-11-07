package com.example.moduche.domain.login.controller;

import java.time.Duration;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.moduche.domain.login.dto.IdTestDTO;
import com.example.moduche.domain.login.dto.LoginRequestDTO;
import com.example.moduche.domain.login.dto.LoginResponseDTO;
import com.example.moduche.domain.login.service.LoginService;
import com.example.moduche.global.Response;
import com.example.moduche.global.StatusEnum;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/login")
public class LoginController {
	
	private final LoginService loginService;

	@PostMapping("") 
	public ResponseEntity<Response> idTest(@RequestBody LoginRequestDTO requestDTO) {
		LoginResponseDTO responseDTO = loginService.login(requestDTO);
		if(!responseDTO.isSuccess()) 
			return ResponseEntity.ok().body(new Response(StatusEnum.OK, responseDTO.getMessage(), null));
		
		ResponseCookie cookie = ResponseCookie.from("refreshToken", responseDTO.getRefreshToken())
				.httpOnly(true)
				.secure(true)
				.path("/")
				.maxAge(Duration.ofDays(14))
				.sameSite("Strict")
				.build();
		
		 return ResponseEntity.ok()
         .header(HttpHeaders.SET_COOKIE, cookie.toString())
         .body(new Response(StatusEnum.OK, responseDTO.getMessage(), responseDTO.getAccessToken()));
	}
}
