package com.example.moduche.domain.inquiry.mapper;

import com.example.moduche.domain.inquiry.InquiryAnswer;
import com.example.moduche.domain.inquiry.dto.InquiryDetailResponse;

import java.time.format.DateTimeFormatter;

public class InquiryAnswerMapper {

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public static InquiryDetailResponse.AnswerResponse toResponse(InquiryAnswer answer) {

        if (answer == null) return null;

        InquiryDetailResponse.AnswerResponse dto = new InquiryDetailResponse.AnswerResponse();

        dto.setAnswerId(answer.getAnswerId());
        dto.setContent(answer.getContent());
        dto.setCreatedAt(answer.getCreatedAt().format(FORMATTER));

        if (answer.getAnsweredByUsername() != null) {
            dto.setAnsweredBy(answer.getAnsweredByUsername());
        } else if (answer.getAnsweredBy() != null) {
            dto.setAnsweredBy(answer.getAnsweredBy().getUsername());
        } else {
            dto.setAnsweredBy("unknown");
        }

        return dto;
    }
}
