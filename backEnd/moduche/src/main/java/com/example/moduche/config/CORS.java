package com.example.moduche.config;

import java.util.List;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CORS implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // 백엔드 API 경로
                .allowedOrigins(
                    "http://localhost:3000",   // CRA
                    "http://localhost:5173"    // Vite
                )
                .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Location")   // 필요 시 노출 헤더
                .allowCredentials(true)
                .maxAge(3600);
    }
}
