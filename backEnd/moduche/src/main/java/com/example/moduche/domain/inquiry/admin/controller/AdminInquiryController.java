package com.example.moduche.domain.inquiry.admin.controller;

import com.example.moduche.domain.inquiry.Inquiry;
import com.example.moduche.domain.inquiry.InquiryAnswer;
import com.example.moduche.domain.inquiry.dto.AdminInquiryListResponse;
import com.example.moduche.domain.inquiry.dto.AnswerCreateRequest;
import com.example.moduche.domain.inquiry.dto.InquiryDetailResponse;
import com.example.moduche.domain.inquiry.enums.InquiryStatus;
import com.example.moduche.domain.inquiry.mapper.AdminInquiryMapper;
import com.example.moduche.domain.inquiry.mapper.InquiryMapper;
import com.example.moduche.domain.inquiry.service.InquiryAnswerService;
import com.example.moduche.domain.inquiry.service.InquiryService;
import com.example.moduche.global.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/inquiries")
@RequiredArgsConstructor
public class AdminInquiryController {

    private final InquiryService inquiryService;
    private final InquiryAnswerService answerService;
    private final JwtTokenProvider jwtTokenProvider;

    /** 관리자 username 검증 */
    private String getAdminUsername(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new RuntimeException("관리자 인증 실패");
        }

        String raw = token.substring(7);
        String role = jwtTokenProvider.getRole(raw);

        if (!(role.equals("SUPER_ADMIN") || role.equals("ADMIN"))) {
            throw new RuntimeException("관리자 권한 없음");
        }

        return jwtTokenProvider.getUsername(raw);
    }

    /** 관리자 목록 조회 */
    @GetMapping
    public Page<AdminInquiryListResponse> adminList(
            @RequestHeader("Authorization") String token,
            @RequestParam(value = "status", required = false) String statusStr,
            Pageable pageable
    ) {
        getAdminUsername(token);

        InquiryStatus status = null;
        if (statusStr != null && !statusStr.isBlank()) {
            status = InquiryStatus.valueOf(statusStr);
        }

        Page<Inquiry> page = (status != null)
                ? inquiryService.getInquiriesByStatus(status, pageable)
                : inquiryService.getAllInquiries(pageable);

        return page.map(AdminInquiryMapper::toListDto);
    }

    /** 관리자 상세 조회 */
    @GetMapping("/{id}")
    public InquiryDetailResponse detail(
            @RequestHeader("Authorization") String token,
            @PathVariable("id") Long id
    ) {
        getAdminUsername(token);
        Inquiry inquiry = inquiryService.getInquiryDetail(id, null, true);
        return InquiryMapper.toDetailResponse(inquiry);
    }

    /** 답변 작성 */
    @PostMapping("/{id}/answer")
    public InquiryAnswer createAnswer(
            @RequestHeader("Authorization") String token,
            @PathVariable("id") Long id,
            @RequestBody AnswerCreateRequest req
    ) {
        String adminUsername = getAdminUsername(token);
        return answerService.createAnswer(id, adminUsername, req); // 🔥 adminId 제거!
    }

    /** 답변 수정 */
    @PutMapping("/answer/{answerId}")
    public InquiryAnswer updateAnswer(
            @RequestHeader("Authorization") String token,
            @PathVariable("answerId") Long answerId,
            @RequestBody AnswerCreateRequest req
    ) {
        String adminUsername = getAdminUsername(token);
        return answerService.updateAnswer(answerId, adminUsername, req);
    }

    /** 답변 삭제 */
    @DeleteMapping("/answer/{answerId}")
    public void deleteAnswer(
            @RequestHeader("Authorization") String token,
            @PathVariable("answerId") Long answerId
    ) {
        getAdminUsername(token);
        answerService.deleteAnswer(answerId);
    }
}
