package com.example.moduche.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 프론트 주소들
        configuration.setAllowedOrigins(
                List.of("http://localhost:3000", "http://localhost:5173")
        );

        // 허용 메서드
        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        );

        // 허용 헤더
        configuration.setAllowedHeaders(List.of("*"));

        // 인증 쿠키/헤더 허용 (JWT 쓸 거니까 true)
        configuration.setAllowCredentials(true);

        // 필요하면 노출 헤더 추가
        configuration.setExposedHeaders(List.of("Location"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 🔥 모든 경로에 이 CORS 설정 적용
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
