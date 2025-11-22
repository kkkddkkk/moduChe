package com.example.moduche.domain.inquiry.service;

import com.example.moduche.domain.inquiry.Inquiry;
import com.example.moduche.domain.inquiry.InquiryAnswer;
import com.example.moduche.domain.inquiry.dto.AnswerCreateRequest;
import com.example.moduche.domain.inquiry.enums.InquiryStatus;
import com.example.moduche.domain.inquiry.repository.InquiryAnswerRepository;
import com.example.moduche.domain.inquiry.repository.InquiryRepository;
import com.example.moduche.domain.login.User;
import com.example.moduche.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class InquiryAnswerService {

    private final InquiryRepository inquiryRepository;
    private final InquiryAnswerRepository inquiryAnswerRepository;
    private final UserRepository userRepository;

    /** 1. 답변 생성 */
    public InquiryAnswer createAnswer(Long inquiryId, String adminUsername, String role, AnswerCreateRequest req) {

        validateAdminRole(role);

        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("해당 문의가 존재하지 않습니다."));

        if (inquiry.getAnswer() != null) {
            throw new RuntimeException("이미 답변이 등록된 문의입니다.");
        }

        User admin = userRepository.findByUserName(adminUsername)
                .orElseThrow(() -> new RuntimeException("관리자 정보를 찾을 수 없습니다."));

        InquiryAnswer answer = new InquiryAnswer();
        answer.setInquiry(inquiry);
        answer.setAnsweredBy(admin);
        answer.setAnsweredByUsername(admin.getUsername());
        answer.setContent(req.getContent());

        // 상태 변경
        inquiry.setStatus(InquiryStatus.ANSWERED);

        // 양방향 연관관계 설정
        inquiry.setAnswer(answer);

        return inquiryAnswerRepository.save(answer);
    }

    /** 2. 답변 수정 */
    public InquiryAnswer updateAnswer(Long answerId, String adminUsername, String role, AnswerCreateRequest req) {

        validateAdminRole(role);

        InquiryAnswer answer = inquiryAnswerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("답변이 존재하지 않습니다."));

        answer.setContent(req.getContent());

        return inquiryAnswerRepository.save(answer);
    }

    /** 3. 답변 삭제 */
    public void deleteAnswer(Long answerId, String role) {

        validateAdminRole(role);

        InquiryAnswer answer = inquiryAnswerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("답변이 존재하지 않습니다."));

        Inquiry inquiry = answer.getInquiry();

        // 상태 되돌리기
        inquiry.setStatus(InquiryStatus.WAIT);

        // 양방향 제거
        inquiry.setAnswer(null);

        inquiryAnswerRepository.delete(answer);
    }

    /** 관리자 권한 체크 */
    private void validateAdminRole(String role) {
        if (role == null ||
                !(role.equals("SUPER_ADMIN") ||
                        role.equals("ADMIN") ||
                        role.equals("CS_MANAGER"))) {
            throw new RuntimeException("관리자 권한이 없습니다.");
        }
    }
}
