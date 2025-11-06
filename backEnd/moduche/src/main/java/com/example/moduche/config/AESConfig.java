package com.example.moduche.config;

import java.util.Properties;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import com.example.moduche.domain.login.service.EmailService;
import com.example.moduche.util.AESUtil;

@Configuration
public class AESConfig {
	@Value("${AES_KEY}")
    private String secretKey;
	
	@Bean
	public AESUtil aesUtil() {
		return new AESUtil(secretKey);
	}
}
