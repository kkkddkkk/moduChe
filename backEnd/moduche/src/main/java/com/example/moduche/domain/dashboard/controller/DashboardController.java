package com.example.moduche.domain.dashboard.controller;

import com.example.moduche.domain.dashboard.dto.DashboardSummaryDto;
import com.example.moduche.domain.dashboard.dto.DashboardTrendDto;
import com.example.moduche.domain.dashboard.service.DashboardService;
import com.example.moduche.global.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final JwtTokenProvider jwtTokenProvider;

    private void requireAdmin(String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("로그인이 필요합니다.");
        }

        String token = header.substring(7);
        String role = jwtTokenProvider.getRole(token);

        if (role == null) {
            throw new RuntimeException("권한 정보 없음");
        }

        String normalized = role.trim().toUpperCase();

        // 허용되는 관리자 권한 목록
        List<String> adminRoles = List.of("ADMIN", "SUPER_ADMIN");

        if (adminRoles.stream().noneMatch(normalized::contains)) {
            throw new RuntimeException("관리자 권한이 필요합니다.");
        }
    }


    @GetMapping("/summary")
    public DashboardSummaryDto summary(
            @RequestHeader(value = "Authorization", required = false) String header
    ) {
        requireAdmin(header);
        return dashboardService.getSummary();
    }

    @GetMapping("/trend")
    public DashboardTrendDto trend(
            @RequestHeader(value = "Authorization", required = false) String header
    ) {
        requireAdmin(header);
        return dashboardService.getTrend();
    }
}
