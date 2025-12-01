package com.example.moduche.domain.inquiry.service;

import com.example.moduche.domain.inquiry.Inquiry;
import com.example.moduche.domain.inquiry.InquiryAnswer;
import com.example.moduche.domain.inquiry.dto.AnswerCreateRequest;
import com.example.moduche.domain.inquiry.enums.InquiryStatus;
import com.example.moduche.domain.inquiry.repository.InquiryAnswerRepository;
import com.example.moduche.domain.inquiry.repository.InquiryRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InquiryAnswerService {

    private final InquiryAnswerRepository answerRepository;
    private final InquiryRepository inquiryRepository;

    /* -------------------------------------------------------
       1) 답변 생성
    -------------------------------------------------------- */
    @Transactional
    public InquiryAnswer createAnswer(Long inquiryId, String adminUsername, AnswerCreateRequest req) {

        Inquiry inq = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("문의 없음"));

        if (inq.getAnswer() != null)
            throw new RuntimeException("이미 답변이 존재합니다.");

        InquiryAnswer ans = new InquiryAnswer();
        ans.setInquiry(inq);
        ans.setAnsweredByUsername(adminUsername);  // 👍 username만 저장
        ans.setContent(req.getContent());

        inq.setAnswer(ans);

        return answerRepository.save(ans);
    }

    /* -------------------------------------------------------
       2) 답변 수정
    -------------------------------------------------------- */
    @Transactional
    public InquiryAnswer updateAnswer(Long answerId, String adminUsername, AnswerCreateRequest req) {

        InquiryAnswer ans = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("답변 없음"));

        ans.setContent(req.getContent());
        ans.setAnsweredByUsername(adminUsername);

        // 연결된 문의 상태는 ANSWERED 유지
        Inquiry inq = ans.getInquiry();
        if (inq.getStatus() != InquiryStatus.ANSWERED) {
            inq.setStatus(InquiryStatus.ANSWERED);
        }

        return ans; // @Transactional 이므로 flush 자동 수행됨
    }

    /* -------------------------------------------------------
       3) 답변 삭제
    -------------------------------------------------------- */
    @Transactional
    public void deleteAnswer(Long answerId) {

        InquiryAnswer ans = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("답변 없음"));

        Inquiry inq = ans.getInquiry();

        // 연결 끊기
        inq.setAnswer(null);
        inq.setStatus(InquiryStatus.WAIT); // 다시 '답변 대기'로 변경

        answerRepository.delete(ans);
    }
}
