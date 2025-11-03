package com.example.moduche.domain.login.service;

import java.io.File;
import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.moduche.domain.login.EmailVerification;
import com.example.moduche.domain.login.repository.EmailVerificationRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Transactional
@Service
@RequiredArgsConstructor
public class EmailService {

	private final JavaMailSender emailSender;
	
    @Value("${spring.mail.username}")
    private String fromEmail; // application.properties에서 가져옴

	// 이메일 전송
	public void sendEmail(String toEmail, String title, String content) throws MessagingException {
		MimeMessage message = emailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);
		ClassPathResource resource = new ClassPathResource("static/MODUCHE_LOGO.png");
		
		helper.setFrom(fromEmail);
		helper.setTo(toEmail);
		helper.setSubject(title);
		helper.addInline("logo", resource);
		helper.setText(content, true);//HTML을 사용 가능하게

		try {
			emailSender.send(message);
		} catch (RuntimeException e) {
			e.printStackTrace();
			throw new RuntimeException("이메일을 발송할 수 없습니다.", e);
		}
	}

	// 랜덤코드 생성
	public String createRandomCode() {//6자리
		int random = ThreadLocalRandom.current().nextInt(100000, 1000000);
		return random+"";
	}

}
