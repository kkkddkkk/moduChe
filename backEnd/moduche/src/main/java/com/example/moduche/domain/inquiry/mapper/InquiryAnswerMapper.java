package com.example.moduche.domain.inquiry.mapper;

import com.example.moduche.domain.inquiry.InquiryAnswer;
import com.example.moduche.domain.inquiry.dto.InquiryDetailResponse;

import java.time.format.DateTimeFormatter;

public class InquiryAnswerMapper {

    private static final DateTimeFormatter F =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public static InquiryDetailResponse.AnswerDto toDto(InquiryAnswer answer) {

        if (answer == null) return null;

        InquiryDetailResponse.AnswerDto dto = new InquiryDetailResponse.AnswerDto();

        dto.setAnswerId(answer.getAnswerId());
        dto.setContent(answer.getContent());
        dto.setAnsweredByUsername(answer.getAnsweredByUsername());

        dto.setCreatedAt(
                answer.getCreatedAt() != null ? answer.getCreatedAt().format(F) : null
        );

        return dto;
    }
}
