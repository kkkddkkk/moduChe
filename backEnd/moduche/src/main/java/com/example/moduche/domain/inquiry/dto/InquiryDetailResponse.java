package com.example.moduche.domain.inquiry.dto;

import com.example.moduche.domain.inquiry.enums.InquiryCategory;
import com.example.moduche.domain.inquiry.enums.InquiryStatus;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class InquiryDetailResponse {

    private Long inquiryId;
    private String username;
    private String title;
    private String content;
    private InquiryCategory category;
    private boolean secret;
    private InquiryStatus status;
    private String createdAt;

    private AnswerResponse answer;

    @Getter @Setter
    public static class AnswerResponse {
        private Long answerId;
        private String answeredBy;
        private String content;
        private String createdAt;
    }
}
