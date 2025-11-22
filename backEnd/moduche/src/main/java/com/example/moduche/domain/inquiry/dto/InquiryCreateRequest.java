package com.example.moduche.domain.inquiry.dto;

import com.example.moduche.domain.inquiry.enums.InquiryCategory;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class InquiryCreateRequest {
    private String title;
    private String content;
    private InquiryCategory category;
    private boolean secret;
}
