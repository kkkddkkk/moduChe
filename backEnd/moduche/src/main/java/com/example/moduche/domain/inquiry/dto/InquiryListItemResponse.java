package com.example.moduche.domain.inquiry.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InquiryListItemResponse {

    private Long inquiryId;
    private String title;
    private String previewContent;
    private String category;
    private String status;
    private boolean secret;   // ← 엔티티의 secret 그대로
    private String createdAt;
}
