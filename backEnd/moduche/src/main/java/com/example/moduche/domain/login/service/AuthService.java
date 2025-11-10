package com.example.moduche.domain.login.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.apache.commons.codec.digest.DigestUtils;
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
public class AuthService {
	
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider jwtTokenProvider;
	private final RefreshTokenRepository refreshTokenRepository;
	
	//로그인 시도
	public LoginResponseDTO login(LoginRequestDTO dto) {
		Optional<User> userOp = userRepository.findByUserName(dto.getLoginId());
		
		if(userOp.isEmpty()) {//Id가 없을 경우
			LoginResponseDTO responseDTO = LoginResponseDTO.builder()
					.message("존재하지 않는 ID입니다.")
					.idSuccess(false)
					.allSuccess(false)
					.build();
			return responseDTO;
		}
		
		User user = userOp.get();//Id가 있으면 user get
		String password = user.getPassword();//table에 저장된 password
		if(!passwordEncoder.matches(dto.getPassword(), password)) {//비밀번호가 일치하지 않을 경우
			LoginResponseDTO responseDTO = LoginResponseDTO.builder()
					.message("비밀번호가 일치하지 않습니다.")
					.name(user.getName())
					.idSuccess(true)
					.allSuccess(false)
					.build();
			return responseDTO;
		}
		
		//refresh token 생성 후 DB에 저장
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
				.name(user.getName())
				.idSuccess(true)
				.allSuccess(true)
				.accessToken(jwtTokenProvider.createAccessToken(user))
				.refreshToken(rawRefreshToken)
				.build();
		
		return responseDTO;
	}
	
	//accessToken 만료 시 refreshToken으로 재발급
	public LoginResponseDTO reissue(String refreshToken) {
		LoginResponseDTO responseDTO = new LoginResponseDTO();
		if(!jwtTokenProvider.validateToken(refreshToken)) {
			responseDTO.setAllSuccess(false);
			responseDTO.setMessage("Refresh Token이 만료되었습니다.");
			return responseDTO;
		}
		String userName = jwtTokenProvider.getUsername(refreshToken);
		
		Optional<RefreshToken> refreshTokenOp = refreshTokenRepository.findByUserName(userName);
		
		if(refreshTokenOp.isEmpty()) {
			responseDTO.setAllSuccess(false);
			responseDTO.setMessage("로그아웃 되었습니다.");
			return responseDTO;
		}
		
		String hashedToken = DigestUtils.sha256Hex(refreshToken);
		String savedRefreshToken = refreshTokenOp.get().getTokenHash();
		
		if(!savedRefreshToken.equals(hashedToken)) {
			responseDTO.setAllSuccess(false);
			responseDTO.setMessage("Refresh Token이 일치하지 않습니다.");
			return responseDTO;
		}
		
		Optional<User> userOp = userRepository.findByUserName(userName);
		if(userOp.isEmpty()) {
			responseDTO.setAllSuccess(false);
			responseDTO.setMessage("존재하지 않는 유저입니다.");
			return responseDTO;
		}
		User user = userOp.get();
		
		String newAccessToken = jwtTokenProvider.createAccessToken(user);
		responseDTO.setAccessToken(newAccessToken);
		responseDTO.setAllSuccess(false);
		responseDTO.setMessage("accessToken이 재발급되었습니다.");
		
		return responseDTO;
	}
	
	@Transactional
	public void deleteToken(String username) {
		refreshTokenRepository.deleteByUserName(username);
	}
	
	//비밀번호 변경
	@Transactional
	public void changePw(String username, String password) {
		User user = userRepository.findByUserName(username).orElseThrow();
		user.setPassword(passwordEncoder.encode(password));
	}

}
