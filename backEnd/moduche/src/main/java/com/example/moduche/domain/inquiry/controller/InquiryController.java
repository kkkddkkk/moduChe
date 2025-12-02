package com.example.moduche.domain.inquiry.controller;

import com.example.moduche.domain.inquiry.Inquiry;
import com.example.moduche.domain.inquiry.dto.InquiryCreateRequest;
import com.example.moduche.domain.inquiry.dto.InquiryDetailResponse;
import com.example.moduche.domain.inquiry.dto.InquiryListItemResponse;
import com.example.moduche.domain.inquiry.mapper.InquiryMapper;
import com.example.moduche.domain.inquiry.service.InquiryService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    /** 
     * 🔥 SecurityContext에서 username 가져오기 
     * - 로그인: username 반환
     * - 비로그인: null 반환
     */
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth == null || !auth.isAuthenticated()) return null;

        String name = auth.getName();

        // 비로그인 anonymousUser 필터
        if ("anonymousUser".equals(name)) return null;

        return name;
    }

    /* ---------------------------
       1) 전체 목록 조회 (공개)
    --------------------------- */
    @GetMapping
    public Page<InquiryListItemResponse> list(Pageable pageable) {
        return inquiryService.getAllInquiries(pageable)
                .map(InquiryMapper::toListItem);
    }

    /* ---------------------------
       2) 내 문의 조회 (로그인)
    --------------------------- */
    @GetMapping("/my")
    public Page<InquiryListItemResponse> myList(Pageable pageable) {

        String username = getCurrentUsername();
        return inquiryService.getMyInquiries(username, pageable)
                .map(InquiryMapper::toListItem);
    }

    /* ---------------------------
       3) 상세 조회 (비밀글 권한 체크)
    --------------------------- */
    @GetMapping("/{id}")
    public InquiryDetailResponse detail(@PathVariable("id") Long id) {

        String username = getCurrentUsername(); // 로그인 안 되어있으면 null

        Inquiry inq = inquiryService.getInquiryDetail(id, username, false);
        return InquiryMapper.toDetailResponse(inq);
    }

    /* ---------------------------
       4) 문의 작성 (로그인)
    --------------------------- */
    @PostMapping
    public Long create(@RequestBody InquiryCreateRequest req) {

        String username = getCurrentUsername();
        Inquiry created = inquiryService.createInquiry(username, req);

        return created.getInquiryId();
    }

    /* ---------------------------
       5) 문의 수정 (작성자만)
    --------------------------- */
    @PutMapping("/{id}")
    public void update(
    		@PathVariable("id") Long id,
            @RequestBody InquiryCreateRequest req) {

        String username = getCurrentUsername();
        inquiryService.updateInquiry(id, username, req);
    }

    /* ---------------------------
       6) 문의 삭제 (작성자만)
    --------------------------- */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {

        String username = getCurrentUsername();
        inquiryService.deleteInquiry(id, username);
    }
}
