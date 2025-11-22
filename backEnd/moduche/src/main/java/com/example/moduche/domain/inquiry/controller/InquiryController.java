package com.example.moduche.domain.inquiry.controller;

import com.example.moduche.domain.inquiry.Inquiry;
import com.example.moduche.domain.inquiry.dto.InquiryCreateRequest;
import com.example.moduche.domain.inquiry.dto.InquiryDetailResponse;
import com.example.moduche.domain.inquiry.mapper.InquiryMapper;
import com.example.moduche.domain.inquiry.service.InquiryService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    /** 문의 작성 */
    @PostMapping
    public InquiryDetailResponse createInquiry(
            @AuthenticationPrincipal String username,
            @RequestBody InquiryCreateRequest req) {

        Inquiry inquiry = inquiryService.createInquiry(username, req);
        return InquiryMapper.toDetailResponse(inquiry);
    }

    /** 내 문의 목록 */
    @GetMapping("/my")
    public Page<Inquiry> getMyInquiries(
            @AuthenticationPrincipal String username,
            Pageable pageable) {

        return inquiryService.getMyInquiries(username, pageable);
    }

    /** 내 문의 상세 */
    @GetMapping("/my/{id}")
    public InquiryDetailResponse getMyInquiryDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal String username) {

        Inquiry inquiry = inquiryService.getInquiryDetail(id, username, false);
        return InquiryMapper.toDetailResponse(inquiry);
    }

    /** 전체 문의 목록(공개) */
    @GetMapping
    public Page<Inquiry> getAllInquiries(Pageable pageable) {
        return inquiryService.getAllInquiries(pageable);
    }

    /** 문의 상세(비밀글 접근 포함) */
    @GetMapping("/{id}")
    public InquiryDetailResponse getInquiryDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal String username) {

        Inquiry inquiry = inquiryService.getInquiryDetail(id, username, false);
        return InquiryMapper.toDetailResponse(inquiry);
    }

    /** 문의 수정 */
    @PutMapping("/{id}")
    public InquiryDetailResponse updateInquiry(
            @PathVariable Long id,
            @AuthenticationPrincipal String username,
            @RequestBody InquiryCreateRequest req) {

        Inquiry inquiry = inquiryService.updateInquiry(id, username, req);
        return InquiryMapper.toDetailResponse(inquiry);
    }

    /** 문의 삭제 */
    @DeleteMapping("/{id}")
    public void deleteInquiry(
            @PathVariable Long id,
            @AuthenticationPrincipal String username) {

        inquiryService.deleteInquiry(id, username);
    }
}
