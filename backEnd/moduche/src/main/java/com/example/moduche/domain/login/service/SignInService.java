package com.example.moduche.domain.login.service;

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
import com.example.moduche.domain.myFit.MyFitMeasure;
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
public class SignInService {

	private final EmailVerificationRepository emailVerificationRepository;
	private final EmailService emailService;
	private final SpringTemplateEngine templateEngine;
	private final UserRepository userRepository;
	private final FacilityRepository facilityRepository;
	private final FacilityUserRepository facilityUserRepository;
	private final RoleRepository roleRepository;
	private final UserRoleRepository userRoleRepository;
	private final DisabilityRepository disabilityRepository;
	private final AccessibilityProfileRepository accessibilityProfileRepository;
	private final AESUtil aesUtil;

	@Autowired
	private PasswordEncoder passwordEncoder;

// ======================================== 이메일 인증 시작 ========================================\\
	@AllArgsConstructor
	public static class EmailCodeResult {// rowcode+entity 같이 가져가기
		private EmailVerification entity;
		private String rawCode;
	}

	// 신청 이력 있는지 검증 후 코드 생성하기
	public EmailCodeResult setVerifyCode(String email) {

		long plusMinuite = 5L;// 몇 분 후 만료될지 설정
		String rawCode = emailService.createRandomCode();
		String hashed = passwordEncoder.encode(rawCode);

		Optional<EmailVerification> rowOp = emailVerificationRepository.findByEmail(email);
		EmailVerification row;
		if (!rowOp.isEmpty()) {// 인증내역이 이미 있다면
			row = rowOp.get();

			if (row.getExpireTime().isBefore(LocalDateTime.now())) {// 만료되면 코드 재생성
				row.setVerifyStatus(VerifyStatus.PENDING);
				row.setCreatedAt(LocalDateTime.now());
				row.setExpireTime(LocalDateTime.now().plusMinutes(plusMinuite));
				row.setVerificationCode(hashed);
			} else if (row.getVerifyStatus() == VerifyStatus.SUCCESS) { // 성공했으면
				row.setVerifyStatus(VerifyStatus.ALREADY_USED);
			} else if (row.getVerifyStatus() == VerifyStatus.PENDING) { // 발급 후 체크를 안했다면
				row.setVerifyStatus(VerifyStatus.NOT_FOUND);
			}

		} else {// 첫 인증이라면 객체 새로 생성

			row = EmailVerification.builder().email(email).verifyStatus(VerifyStatus.PENDING).verificationCode(hashed)
					.createdAt(LocalDateTime.now()).expireTime(LocalDateTime.now().plusMinutes(plusMinuite)).build();
		}

		return new EmailCodeResult(row, rawCode);
	}

	// 이메일 발송
	public EmailVerification sendCodeToEmail(String email) {
		EmailCodeResult set = setVerifyCode(email);
		EmailVerification row = set.entity;
		String code = set.rawCode;

		emailVerificationRepository.save(row);

		// 상태가 pending이 아니라면 바로 return
		if (row.getVerifyStatus() != VerifyStatus.PENDING)
			return row;

		String title = "[모두의 체육관] 회원가입 본인인증 코드입니다.";

		Context context = new Context();
		context.setVariable("code", code);
		String content = templateEngine.process("emailTemplate", context);

		try {
			emailService.sendEmail(email, title, content);
		} catch (RuntimeException | MessagingException e) {
			e.printStackTrace();
			throw new RuntimeException("signInService/sendCodeToEmail에서 예외 발생", e);
		}

		// 인증코드 return
		return row;
	}

	// 인증코드 유효성 검사
	public VerifyStatus verifyTest(String email, String code) {
		Optional<EmailVerification> verifying = emailVerificationRepository.findByEmail(email);

		if (verifying.isEmpty())
			return VerifyStatus.EMAIL_NOT_FOUND;// row가 없으면 email not found return

		EmailVerification entity = verifying.get();// 코드가 맞으면 객체 생성 후
		// 코드가 안맞으면 not found return
		if (!passwordEncoder.matches(code, entity.getVerificationCode()))
			return VerifyStatus.NOT_FOUND;
		if (entity.getExpireTime().isBefore(LocalDateTime.now()))
			return VerifyStatus.EXPIRED;// 만료 여부 체크

		// 다 통과했으면 통과로 변경
		return VerifyStatus.SUCCESS;
	}

	// 매일 12시에 만료된 코드 모두 삭제
	@Transactional
	@Scheduled(cron = "0 0 0 * * ?")
	public void deleteExpiredCodes() {
		emailVerificationRepository.deleteExpiredCodes(LocalDateTime.now());
	}

//======================================== 이메일 인증 끝 ========================================\\
//======================================== 중복검사+리스트 끝 ========================================\\

	// 아이디 중복검사
	public boolean idTest(String id) {// true면(id로 row를 찾을 수 없으면) 사용가능한 id
		Optional<User> userOp = userRepository.findByUserName(id);

		return userOp.isEmpty();
	}

	// 이메일 중복검사
	public boolean emailTest(String email) {// true면(email로 row를 찾을 수 없으면) 사용가능한 id
		Optional<User> userOp = userRepository.findByEmail(email);

		return userOp.isEmpty();
	}

	// 기관 리스트 가져오기
	public List<FacilityListForSignInDTO> facilityListForSignIn(String search) {
		return facilityRepository.findAllNameAndLoca(search);
	}
	
	//장애 리스트 가져오기
	public List<DisabilityDTO> disabilityListForSignInd(String search){
		return disabilityRepository.findByDisabilityCode(search);
	}

//======================================== 중복검사+리스트 끝 ========================================\\
//======================================== 회원가입 시작 ========================================\\
	public Long individual(IndividualSignInDTO dto) throws Exception {
		//개인회원 회원가입
		Role role = roleRepository.findByRoleCode("INDIVIDUAL").get();		
		
		//user row 생성
		User user = User.builder()
				.username(dto.getUsername())
				.password(passwordEncoder.encode(dto.getPassword()))
				.name(dto.getName())
				.phone(dto.getPhone())
				.email(dto.getEmail())
				.status(UserStatus.ACTIVE)
				.createdAt(LocalDateTime.now())
				.role(role)
				.build();
		userRepository.save(user);
		
		//userRole row 생성
		UserRole userRole = UserRole.builder()
				.user(user)
				.role(role)
				.assignedAt(LocalDateTime.now())
				.build();
		userRoleRepository.save(userRole);
		
		String gender = "";
		if(dto.getGender()%2==0) gender = "F";
		else gender = "M";		
		Disability disability = disabilityRepository.findById(dto.getDisabilityType())
				.orElseThrow(() -> new Exception());
		
		//accessibilityProfile row 생성
		AccessibilityProfile accessibilityProfile = AccessibilityProfile.builder()
				.user(user)
				.birth(dto.getBirth())
				.gender(gender)
				.disability(disability)
				.disabilityGrade(dto.getDisabilityGrade())
				.qualified(dto.isQualified())
				.build();
		accessibilityProfileRepository.save(accessibilityProfile);
		
		return user.getUserId();
		
	}

	// 기관 회원가입
	@Transactional
	public Long facility(FacilitySignInDTO dto) throws Exception {

		Facility facility = facilityRepository.findById(dto.getFacilityId()).orElseThrow(() -> new Exception());
		
		//user row 생성
		User user = User.builder()
				.username(dto.getUsername())
				.password(passwordEncoder.encode(dto.getPassword()))
				.name(facility.getFacilityName())
				.phone(dto.getPhone())
				.email(dto.getEmail())
				.status(UserStatus.ACTIVE)
				.createdAt(LocalDateTime.now())
				.role(roleRepository.findByRoleCode("FACILITY").get())
				.build();

		userRepository.save(user);
		
		//facility update
		facility.setBoss(dto.getBoss());
		facility.setBusiness_num(aesUtil.aesEncode(dto.getBusinessNum()));

		//userRole row 생성
		UserRole userRole = UserRole.builder()
				.user(user)
				.role(roleRepository.findByRoleCode("FACILITY").get())
				.assignedAt(LocalDateTime.now())
				.build();
		userRoleRepository.save(userRole);
		
		//facilityUser row 생성
		FacilityUser facilityUser = FacilityUser.builder()
				.facility(facility)
				.user(user)
				.isActive(true)
				.joinedAt(LocalDateTime.now())
				.build();
		facilityUserRepository.save(facilityUser);

		return user.getUserId();
	}

}
