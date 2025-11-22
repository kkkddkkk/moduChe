package com.example.moduche.domain.inquiry.dto;

import java.time.LocalDateTime;

import com.example.moduche.domain.inquiry.enums.InquiryCategory;
import com.example.moduche.domain.inquiry.enums.InquiryStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InquiryListItemResponse {

    private Long inquiryId;
    private String title;
    private String previewContent;
    private InquiryCategory category;   
    private InquiryStatus status;       
    private boolean secret;
    private LocalDateTime createdAt;
}