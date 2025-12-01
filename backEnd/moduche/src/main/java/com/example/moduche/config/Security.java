package com.example.moduche.config;

import com.example.moduche.global.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class Security {

	private final JwtFilter jwtFilter;

	/**
	 * 비밀번호 암호화 설정
	 */
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	/**
	 * Spring Security 필터 체인 설정
	 */
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				// ✅ CORS 설정 적용
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))

				// ✅ CSRF 비활성화 (REST API에서는 일반적으로 비활성)
				.csrf(csrf -> csrf.disable())

				// ✅ URL별 접근 권한 설정
				.authorizeHttpRequests(auth -> auth

    /* ================================
     * 🔓 1) 누구나 접근 가능한 공개 API (permitAll)
     * ================================ */
    .requestMatchers(
        "/", 
        "/api/auth/**",
        "/api/signIn/**",
        "/api/email/**",
        "/api/find/**",
        "/api/noticeForAll/**",
        "/api/main/**",
        "/api/course/**",
        "/api/search/**",
        "/api/payment/**",
        "/api/banner/**",
        "/api/redis/**",
        "/api/users/**",
        "/api/reports/**",
        "/api/admin/reports/**",
        "/api/admin/inquiries/**",     // 관리자 문의 관련 (권한은 컨트롤러 내부에서 체크)
        "/api/admins/**",
        "/api/admin/dashboard/**",
        "/api/facilities/**"           // 시설 관리자 API → 내부에서 권한 체크
    ).permitAll()

    /* ================================
     * 🔓 2) Inquiry GET 전체 공개
     * ================================ */
    .requestMatchers(HttpMethod.GET, "/api/inquiries/**").permitAll()

    /* ================================
     * 🔐 3) Inquiry 작성/수정/삭제 = 로그인 필요
     * ================================ */
    .requestMatchers(HttpMethod.POST, "/api/inquiries/**").authenticated()
    .requestMatchers(HttpMethod.PUT, "/api/inquiries/**").authenticated()
    .requestMatchers(HttpMethod.DELETE, "/api/inquiries/**").authenticated()

    /* ================================
     * 🔐 4) 그 외 모든 요청 → 인증 필요
     * ================================ */
    .anyRequest().authenticated()
)


				// ✅ JWT 필터를 UsernamePasswordAuthenticationFilter 앞에 추가
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

				// ✅ 기본 로그인 폼/HTTP Basic 인증 비활성화
				.formLogin(form -> form.disable()).httpBasic(httpBasic -> httpBasic.disable());

		return http.build();
	}

	/**
	 * ✅ CORS 전역 설정 (React 등 외부 프론트엔드 접근 허용)
	 */
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();

		// React 개발 서버 주소 (필요 시 추가 가능)
		configuration.setAllowedOrigins(List.of("http://localhost:3000"));

		// 허용할 HTTP 메서드
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

		// 모든 헤더 허용
		configuration.setAllowedHeaders(List.of("*"));

		// 인증 정보(쿠키, JWT 등) 포함 요청 허용
		configuration.setAllowCredentials(true);

		// URL 패턴에 이 CORS 설정 적용
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);

		return source;
	}
}
