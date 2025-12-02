package com.example.moduche.domain.inquiry.mapper;

import com.example.moduche.domain.inquiry.Inquiry;
import com.example.moduche.domain.inquiry.dto.InquiryListItemResponse;

import java.time.format.DateTimeFormatter;

public class PublicInquiryMapper {

    private static final DateTimeFormatter F =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public static InquiryListItemResponse toListDto(Inquiry inq) {
        InquiryListItemResponse dto = new InquiryListItemResponse();

        dto.setInquiryId(inq.getInquiryId());
        dto.setTitle(inq.getTitle());

        // 30자 미리보기
        String preview = inq.getContent();
        if (preview != null && preview.length() > 30)
            preview = preview.substring(0, 30) + "...";
        dto.setPreviewContent(preview);

        dto.setCategory(inq.getCategory().name());
        dto.setStatus(inq.getStatus().name());
        dto.setSecret(inq.isSecret()); // 🔥 여기!
        dto.setCreatedAt(inq.getCreatedAt() != null ? inq.getCreatedAt().format(F) : null);

        return dto;
    }
}
