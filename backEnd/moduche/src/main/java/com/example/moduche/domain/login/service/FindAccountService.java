package com.example.moduche.domain.login.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.moduche.domain.login.User;

import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Transactional
@Service
@RequiredArgsConstructor
public class FindAccountService {

	private final UserRepository userRepository;

// ======================================== 이메일 인증 시작 ========================================\\

	// ID 존재하는지 검증
	public boolean isThereId(String email) {
		Optional<User> userOp = userRepository.findByEmail(email);
		return !userOp.isEmpty();
	}
	
	// ID와 이메일이 일치하는지 확인
	public boolean isIdAvailable(String username, String email) {
		User user = userRepository.findByEmail(email).orElseThrow();
		return user.getUsername().equals(username);
	}
	
}
