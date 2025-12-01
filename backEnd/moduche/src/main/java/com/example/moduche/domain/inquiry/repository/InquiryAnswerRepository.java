package com.example.moduche.domain.inquiry.repository;

import com.example.moduche.domain.inquiry.InquiryAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InquiryAnswerRepository extends JpaRepository<InquiryAnswer, Long> {

    boolean existsByInquiryInquiryId(Long inquiryId);

    InquiryAnswer findByInquiryInquiryId(Long inquiryId);
}

