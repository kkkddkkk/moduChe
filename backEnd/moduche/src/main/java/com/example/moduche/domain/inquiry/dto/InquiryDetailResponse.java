package com.example.moduche.domain.inquiry.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InquiryDetailResponse {

    private Long inquiryId;
    private String username;
    private String title;
    private String content;
    private String category;
    private String status;
    private boolean secret;
    private String createdAt;

    private AnswerDto answer;

    @Getter
    @Setter
    public static class AnswerDto {
        private Long answerId;
        private String content;
        private String answeredByUsername;
        private String createdAt;
    }
}
