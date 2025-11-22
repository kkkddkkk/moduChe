package com.example.moduche.domain.inquiry.service;

import com.example.moduche.domain.inquiry.Inquiry;
import com.example.moduche.domain.inquiry.dto.InquiryCreateRequest;
import com.example.moduche.domain.inquiry.enums.InquiryCategory;
import com.example.moduche.domain.inquiry.enums.InquiryStatus;
import com.example.moduche.domain.inquiry.repository.InquiryRepository;
import com.example.moduche.domain.login.User;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final UserRepository userRepository;

    /** 1) 문의 작성 */
    public Inquiry createInquiry(String username, InquiryCreateRequest req) {

        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("사용자 정보 없음"));

        Inquiry inquiry = new Inquiry();
        inquiry.setUser(user);
        inquiry.setUsername(user.getUsername());
        inquiry.setTitle(req.getTitle());
        inquiry.setContent(req.getContent());

        // ★ 수정: Enum 그대로 세팅
        inquiry.setCategory(req.getCategory());

        inquiry.setSecret(req.isSecret());
        inquiry.setStatus(InquiryStatus.WAIT);

        return inquiryRepository.save(inquiry);
    }

    /** 2) 상세 조회 */
    public Inquiry getInquiryDetail(Long id, String loginUser, boolean isAdmin) {

        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문의 없음"));

        if (inquiry.isSecret()) {
            boolean owner = inquiry.getUsername().equals(loginUser);
            if (!owner && !isAdmin) {
                throw new RuntimeException("비밀글 접근 권한 없음");
            }
        }

        return inquiry;
    }

    /** 3) 수정 */
    public Inquiry updateInquiry(Long id, String username, InquiryCreateRequest req) {

        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문의 없음"));

        if (!inquiry.getUsername().equals(username)) {
            throw new RuntimeException("작성자만 수정할 수 있습니다.");
        }

        inquiry.setTitle(req.getTitle());
        inquiry.setContent(req.getContent());

        // ★ 수정: Enum 그대로 세팅
        inquiry.setCategory(req.getCategory());

        inquiry.setSecret(req.isSecret());

        return inquiryRepository.save(inquiry);
    }

    /** 4) 삭제 */
    public void deleteInquiry(Long id, String username) {

        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문의 없음"));

        if (!inquiry.getUsername().equals(username)) {
            throw new RuntimeException("작성자만 삭제할 수 있습니다.");
        }

        inquiryRepository.delete(inquiry);
    }

    /** 5) 전체 목록 */
    public Page<Inquiry> getAllInquiries(Pageable pageable) {
        return inquiryRepository.findAll(pageable);
    }

    /** 6) 내 문의 목록 */
    public Page<Inquiry> getMyInquiries(String username, Pageable pageable) {

        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("사용자 정보 없음"));

        return inquiryRepository.findByUser(user, pageable);
    }

    /** 7) 상태조회 */
    public Page<Inquiry> getInquiriesByStatus(InquiryStatus status, Pageable pageable) {
        return inquiryRepository.findByStatus(status, pageable);
    }
}
