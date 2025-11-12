package com.example.moduche.domain.login.service;

import java.io.File;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.example.moduche.domain.login.EmailVerification;
import com.example.moduche.domain.login.User;
import com.example.moduche.domain.login.enums.VerifyStatus;
import com.example.moduche.domain.login.repository.EmailVerificationRepository;
import com.example.moduche.repository.UserRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Transactional
@Service
@RequiredArgsConstructor
public class EmailService {

	private final JavaMailSender emailSender;
	private final EmailVerificationRepository emailVerificationRepository;
	private final SpringTemplateEngine templateEngine;
	private final UserRepository userRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Value("${spring.mail.username}")
	private String fromEmail; // application.properties에서 가져옴

	// 이메일 전송
	public void sendEmail(String toEmail, String title, String content) throws MessagingException {
		MimeMessage message = emailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
		ClassPathResource resource = new ClassPathResource("static/MODUCHE_LOGO.png");

		helper.setFrom(fromEmail);
		helper.setTo(toEmail);
		helper.setSubject(title);
		helper.addInline("logo", resource);
		helper.setText(content, true);// HTML을 사용 가능하게

		try {
			emailSender.send(message);
		} catch (RuntimeException e) {
			e.printStackTrace();
			throw new RuntimeException("이메일을 발송할 수 없습니다.", e);
		}
	}

	// 랜덤코드 생성
	public String createRandomCode() {// 6자리
		int random = ThreadLocalRandom.current().nextInt(100000, 1000000);
		return random + "";
	}

	@AllArgsConstructor
	public static class EmailCodeResult {// rowcode+entity 같이 가져가기
		private EmailVerification entity;
		private String rawCode;
	}

	// 신청 이력 있는지 검증 후 코드 생성하기
	public EmailCodeResult setVerifyCode(String email) {

		long plusMinuite = 5L;// 몇 분 후 만료될지 설정
		String rawCode = createRandomCode();
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
		
		//userId가 있을 경우 set
		Optional<User> userOp = userRepository.findByEmail(email);
		if(userOp.isEmpty()) return new EmailCodeResult(row, rawCode);
		Long userId = userOp.get().getUserId();
		row.setUserId(userId);

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
			sendEmail(email, title, content);
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

}
