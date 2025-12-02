package com.example.moduche.domain.inquiry.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InquiryAnswerResponse {

    private Long answerId;
    private String content;

    /** 관리자 username */
    private String answeredByUsername;

    /** ISO-8601 날짜 형식 */
    private String createdAt;
}
