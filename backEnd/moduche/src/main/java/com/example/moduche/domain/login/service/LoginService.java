package com.example.moduche.domain.login.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.moduche.domain.login.RefreshToken;
import com.example.moduche.domain.login.User;
import com.example.moduche.domain.login.dto.LoginRequestDTO;
import com.example.moduche.domain.login.dto.LoginResponseDTO;
import com.example.moduche.domain.login.repository.RefreshTokenRepository;
import com.example.moduche.global.security.JwtTokenProvider;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Transactional
@Service
@RequiredArgsConstructor
public class LoginService {
	
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider jwtTokenProvider;
	private final RefreshTokenRepository refreshTokenRepository;
	

	public LoginResponseDTO login(LoginRequestDTO dto) {
		Optional<User> userOp = userRepository.findByUserName(dto.getLoginId());
		
		if(userOp.isEmpty()) {//Id가 없을 경우
			LoginResponseDTO responseDTO = LoginResponseDTO.builder()
					.message("존재하지 않는 ID입니다.")
					.success(false)
					.build();
			return responseDTO;
		}
		
		User user = userOp.get();//Id가 있으면 user get
		String password = user.getPassword();//table에 저장된 password
		if(!passwordEncoder.matches(dto.getPassword(), password)) {//비밀번호가 일치하지 않을 경우
			LoginResponseDTO responseDTO = LoginResponseDTO.builder()
					.message("비밀번호가 일치하지 않습니다.")
					.success(false)
					.build();
			return responseDTO;
		}
		
		String rawRefreshToken = jwtTokenProvider.createRefreshToken(user);
		String hashedRefreshToken = DigestUtils.sha256Hex(rawRefreshToken);
		RefreshToken refreshToken = RefreshToken.builder()
				.username(user.getUsername())
				.tokenHash(hashedRefreshToken)
				.expire(LocalDateTime.now().plusDays(14L))
				.build();
		refreshTokenRepository.save(refreshToken);
		
		//일치하면 토큰 포함 responseDTO return
		LoginResponseDTO responseDTO = LoginResponseDTO.builder()
				.message(user.getName()+"님, 환영합니다!")
				.success(true)
				.accessToken(jwtTokenProvider.createAccessToken(user))
				.refreshToken(rawRefreshToken)
				.build();
		
		return responseDTO;
	}
}
