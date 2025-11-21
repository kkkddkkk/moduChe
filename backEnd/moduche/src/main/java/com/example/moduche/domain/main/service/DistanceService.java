package com.example.moduche.domain.main.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.example.moduche.domain.community.repository.CommunityRepository;
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
import com.example.moduche.domain.main.dto.CloseCommunityDTO;
import com.example.moduche.domain.main.dto.CloseFacilityDTO;
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
public class DistanceService {

	private final FacilityRepository facilityRepository;
	private final CommunityRepository communityRepository;

	public List<CloseFacilityDTO> fetchCloseFacility(double lat, double lng) {
		List<CloseFacilityDTO> dtos = facilityRepository.findNearby(lat, lng, 3);
		return dtos;
	}
	
	public List<CloseCommunityDTO> fetchCloseCommunity(double lat, double lng) {
		List<CloseCommunityDTO> dtos = communityRepository.findNearby(lat, lng, 3);
		return dtos;
	}
	
	
}
