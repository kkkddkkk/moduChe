package com.example.moduche.domain.inquiry.mapper;

import com.example.moduche.domain.inquiry.Inquiry;
import com.example.moduche.domain.inquiry.dto.InquiryDetailResponse;

import java.time.format.DateTimeFormatter;

public class InquiryMapper {

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public static InquiryDetailResponse toDetailResponse(Inquiry inquiry) {
        InquiryDetailResponse dto = new InquiryDetailResponse();

        dto.setInquiryId(inquiry.getInquiryId());
        dto.setUsername(inquiry.getUsername());
        dto.setTitle(inquiry.getTitle());
        dto.setContent(inquiry.getContent());
        dto.setCategory(inquiry.getCategory());
        dto.setSecret(inquiry.isSecret());
        dto.setStatus(inquiry.getStatus());

        dto.setCreatedAt(inquiry.getCreatedAt().format(FORMATTER));

        dto.setAnswer(InquiryAnswerMapper.toResponse(inquiry.getAnswer()));

        return dto;
    }
}
