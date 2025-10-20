package com.example.moduche;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication(scanBasePackages = "com.example.moduche")                 // ✅ 컴포넌트 스캔
@EntityScan(basePackages = "com.example.moduche.domain")                        // ✅ 엔티티 스캔
@EnableJpaRepositories(basePackages = "com.example.moduche.repository")         // ✅ 리포지토리 패키지(없어도 OK, 있으면 경로 맞춰주세요)
@EnableTransactionManagement
public class ModucheApplication {
    public static void main(String[] args) {
        SpringApplication.run(ModucheApplication.class, args);
    }
}