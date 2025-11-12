package com.example.moduche.domain.myPage.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.example.moduche.domain.facility.Facility;
import com.example.moduche.domain.facility.FacilityUser;
import com.example.moduche.domain.facility.dto.FacilityListForSignInDTO;
import com.example.moduche.domain.facility.repository.FacilityRepository;
import com.example.moduche.domain.facility.repository.FacilityUserRepository;
import com.example.moduche.domain.login.AccessibilityProfile;
import com.example.moduche.domain.login.Disability;
import com.example.moduche.domain.login.EmailVerification;
import com.example.moduche.domain.login.Role;
import com.example.moduche.domain.login.User;
import com.example.moduche.domain.login.UserRole;
import com.example.moduche.domain.login.dto.DisabilityDTO;
import com.example.moduche.domain.login.dto.FacilitySignInDTO;
import com.example.moduche.domain.login.dto.IndividualSignInDTO;
import com.example.moduche.domain.login.enums.UserStatus;
import com.example.moduche.domain.login.enums.VerifyStatus;
import com.example.moduche.domain.login.repository.AccessibilityProfileRepository;
import com.example.moduche.domain.login.repository.DisabilityRepository;
import com.example.moduche.domain.login.repository.EmailVerificationRepository;
import com.example.moduche.domain.login.repository.RoleRepository;
import com.example.moduche.domain.login.repository.UserRoleRepository;
import com.example.moduche.domain.myPage.dto.AccountResponseDTO;
import com.example.moduche.domain.myPage.dto.UpdateAccountRequestDTO;
import com.example.moduche.repository.UserRepository;
import com.example.moduche.util.AESUtil;

import jakarta.mail.MessagingException;
import jakarta.persistence.CascadeType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Transactional
@Service
@RequiredArgsConstructor
public class MyPageService {

	private final UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public boolean matchPassword(String username, String password) {
		User user = userRepository.findByUserName(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
		return passwordEncoder.matches(password, user.getPassword());
	}
	
	public AccountResponseDTO getAccount(String username) {
		User user = userRepository.findByUserName(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
		
		AccountResponseDTO accountResponseDTO = AccountResponseDTO.builder()
				.username(username).name(user.getName()).email(user.getEmail()).build();
		
		return accountResponseDTO;
	}
		
	@Transactional
	public void setAccount(UpdateAccountRequestDTO requestDTO) {
		String username = requestDTO.getUsername();
		User user = userRepository.findByUserName(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
		if (requestDTO.getName() != null) user.setName(requestDTO.getName());
		if (requestDTO.getEmail() != null) user.setEmail(requestDTO.getEmail());
		if (requestDTO.getPassword() != null) user.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
		user.setUpdatedAt(LocalDateTime.now());

	}
}
