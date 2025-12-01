package com.example.moduche.domain.report.controller;

import com.example.moduche.domain.report.dto.ReportCreateRequest;
import com.example.moduche.domain.report.dto.ReportDto;
import com.example.moduche.domain.report.enums.ReportStatus;
import com.example.moduche.domain.report.service.ReportService;
import com.example.moduche.global.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final JwtTokenProvider jwtTokenProvider;

    /** 신고 생성 */
    @PostMapping
    public ReportDto create(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody ReportCreateRequest req
    ) {
        String username = requireLogin(token);
        return reportService.create(req, username);
    }

    /** 신고 목록 조회 */
    @GetMapping
    public List<ReportDto> list(
            @RequestHeader(value = "Authorization") String token
    ) {
        requireAdmin(token);
        return reportService.getAll();
    }

    /** 신고 상세 */
    @GetMapping("/{id}")
    public ReportDto detail(
            @PathVariable("id") Long id,
            @RequestHeader("Authorization") String token
    ) {
        requireAdmin(token);
        return reportService.getDetail(id);
    }

    /** 신고 상태 변경 */
    @PostMapping("/{id}/status")
    public ReportDto updateStatus(
            @PathVariable("id") Long id,
            @RequestBody StatusRequest req,
            @RequestHeader("Authorization") String token
    ) {
        requireAdmin(token);
        return reportService.updateStatus(id, req.status);
    }

    private String requireLogin(String token) {
        if (token == null || !token.startsWith("Bearer "))
            throw new RuntimeException("로그인 필요");

        token = token.substring(7);

        if (!jwtTokenProvider.validateToken(token))
            throw new RuntimeException("유효하지 않은 토큰");

        return jwtTokenProvider.getUsername(token);
    }

    private void requireAdmin(String token) {
        if (token == null || !token.startsWith("Bearer "))
            throw new RuntimeException("Authorization header missing");

        String raw = token.substring(7);

        String role = jwtTokenProvider.getRole(raw);
        if (role == null || !role.contains("ADMIN"))
            throw new RuntimeException("관리자 권한 필요");
    }

    /** 🔥 enum을 직접 받도록 변경 */
    public record StatusRequest(ReportStatus status) {}
}
