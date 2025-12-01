package com.example.moduche.domain.inquiry.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminInquiryListResponse {

    private Long inquiryId;
    private String username;
    private String title;
    private String category;
    private String status;
    private String createdAt;
}
