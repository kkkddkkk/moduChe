package com.example.moduche.domain.inquiry.service;

import com.example.moduche.domain.inquiry.Inquiry;
import com.example.moduche.domain.inquiry.dto.InquiryCreateRequest;
import com.example.moduche.domain.inquiry.enums.InquiryStatus;
import com.example.moduche.domain.inquiry.repository.InquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;

    public Inquiry getById(Long id) {
        return inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문의 없음"));
    }

    @Transactional
    public Inquiry getInquiryDetail(Long id, String username, boolean adminView) {
        Inquiry inq = getById(id);

        // 비밀글 체크
        if (inq.isSecret() && !adminView) {
            boolean isOwner = username != null && username.equals(inq.getUsername());
            if (!isOwner) {
                throw new AccessDeniedException("비밀글에 대한 접근 권한이 없습니다.");
            }
        }

        return inq;
    }

    @Transactional
    public Inquiry createInquiry(String username, InquiryCreateRequest req) {

        Inquiry inq = new Inquiry();
        inq.setUsername(username);
        inq.setTitle(req.getTitle());
        inq.setContent(req.getContent());
        inq.setCategory(req.getCategory());
        inq.setSecret(req.isSecret());
        inq.setStatus(InquiryStatus.WAIT);

        return inquiryRepository.save(inq);
    }

    @Transactional
    public void updateInquiry(Long id, String username, InquiryCreateRequest req) {

        Inquiry inq = getById(id);

        if (!inq.getUsername().equals(username)) {
            throw new AccessDeniedException("본인 글만 수정 가능");
        }

        inq.setTitle(req.getTitle());
        inq.setContent(req.getContent());
        inq.setCategory(req.getCategory());
        inq.setSecret(req.isSecret());
    }

    @Transactional
    public void deleteInquiry(Long id, String username) {
        Inquiry inq = getById(id);

        if (!inq.getUsername().equals(username)) {
            throw new AccessDeniedException("본인 글만 삭제 가능");
        }

        inquiryRepository.delete(inq);
    }

    public Page<Inquiry> getAllInquiries(Pageable pageable) {
        return inquiryRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public Page<Inquiry> getMyInquiries(String username, Pageable pageable) {
        return inquiryRepository.findByUsernameOrderByCreatedAtDesc(username, pageable);
    }

    public Page<Inquiry> getInquiriesByStatus(InquiryStatus status, Pageable pageable) {
        return inquiryRepository.findByStatus(status, pageable);
    }
}
