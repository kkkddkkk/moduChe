package com.example.moduche.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class Security {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // REST API라면 CSRF 비활성화
            .authorizeHttpRequests()
                .anyRequest().permitAll() // 모든 요청 인증 없이 허용
            .and()
            .formLogin().disable() // 기본 로그인 폼 비활성화
            .httpBasic().disable(); // HTTP Basic 인증 비활성화
        return http.build();
    }
}
