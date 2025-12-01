package com.example.moduche.domain.inquiry.mapper;

import com.example.moduche.domain.inquiry.Inquiry;
import com.example.moduche.domain.inquiry.dto.AdminInquiryListResponse;

import java.time.format.DateTimeFormatter;

public class AdminInquiryMapper {

    private static final DateTimeFormatter F =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public static AdminInquiryListResponse toListDto(Inquiry inq) {

        AdminInquiryListResponse dto = new AdminInquiryListResponse();

        dto.setInquiryId(inq.getInquiryId());
        dto.setUsername(inq.getUsername());
        dto.setTitle(inq.getTitle());
        dto.setCategory(inq.getCategory().name());
        dto.setStatus(inq.getStatus().name());
        dto.setCreatedAt(inq.getCreatedAt().format(F));

        return dto;
    }
}
