package com.example.moduche.domain.inquiry.admin.controller;

import com.example.moduche.domain.inquiry.Inquiry;
import com.example.moduche.domain.inquiry.InquiryAnswer;
import com.example.moduche.domain.inquiry.dto.AnswerCreateRequest;
import com.example.moduche.domain.inquiry.dto.InquiryDetailResponse;
import com.example.moduche.domain.inquiry.enums.InquiryStatus;
import com.example.moduche.domain.inquiry.mapper.InquiryMapper;
import com.example.moduche.domain.inquiry.service.InquiryAnswerService;
import com.example.moduche.domain.inquiry.service.InquiryService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/inquiries")
@RequiredArgsConstructor
public class AdminInquiryController {

    private final InquiryService inquiryService;
    private final InquiryAnswerService inquiryAnswerService;

    /** 전체 문의 조회 (필터 optional) */
    @GetMapping
    public Page<Inquiry> getAll(
            @RequestParam(required = false) InquiryStatus status,
            Pageable pageable
    ) {
        return (status != null)
                ? inquiryService.getInquiriesByStatus(status, pageable)
                : inquiryService.getAllInquiries(pageable);
    }

    /** 관리자 상세 조회 (비밀글 포함) */
    @GetMapping("/{id}")
    public InquiryDetailResponse getInquiryDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal String username
    ) {
        Inquiry inquiry = inquiryService.getInquiryDetail(id, username, true);
        return InquiryMapper.toDetailResponse(inquiry);
    }

    /** 답변 생성 */
    @PostMapping("/{id}/answer")
    public InquiryAnswer createAnswer(
            @PathVariable Long id,
            @AuthenticationPrincipal String username,
            Authentication authentication,
            @RequestBody AnswerCreateRequest req
    ) {
        String role = authentication.getAuthorities()
                .iterator().next().getAuthority()
                .replace("ROLE_", "");

        return inquiryAnswerService.createAnswer(id, username, role, req);
    }

    /** 답변 수정 */
    @PutMapping("/answer/{answerId}")
    public InquiryAnswer updateAnswer(
            @PathVariable Long answerId,
            @AuthenticationPrincipal String username,
            Authentication authentication,
            @RequestBody AnswerCreateRequest req
    ) {
        String role = authentication.getAuthorities()
                .iterator().next().getAuthority()
                .replace("ROLE_", "");

        return inquiryAnswerService.updateAnswer(answerId, username, role, req);
    }

    /** 답변 삭제 */
    @DeleteMapping("/answer/{answerId}")
    public void deleteAnswer(
            @PathVariable Long answerId,
            Authentication authentication
    ) {
        String role = authentication.getAuthorities()
                .iterator().next().getAuthority()
                .replace("ROLE_", "");

        inquiryAnswerService.deleteAnswer(answerId, role);
    }
}
