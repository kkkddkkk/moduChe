package com.example.moduche.domain.inquiry.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InquiryAnswerResponse {
    private Long answerId;
    private String content;
    private String answeredBy;
    private LocalDateTime createdAt;
}

