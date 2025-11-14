package com.example.moduche.config;

import com.example.moduche.domain.community.repository.CommunityPostPhotoRepository;
import com.example.moduche.global.security.JwtFilter;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class Security {
	
	private final JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // REST API라면 CSRF 비활성화
            .authorizeHttpRequests(auth -> auth
            	    .requestMatchers("/api/auth/**").permitAll()
            	    .requestMatchers("/").permitAll()
            	    .requestMatchers("/api/signIn/**").permitAll()
                    .anyRequest().authenticated()
                )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .formLogin(form -> form.disable())
            .httpBasic(httpBasic -> httpBasic.disable());
        return http.build();
    }
}
