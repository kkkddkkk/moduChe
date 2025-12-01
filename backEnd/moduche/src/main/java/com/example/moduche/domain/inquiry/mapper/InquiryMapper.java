package com.example.moduche.domain.inquiry.mapper;

import com.example.moduche.domain.inquiry.Inquiry;
import com.example.moduche.domain.inquiry.InquiryAnswer;
import com.example.moduche.domain.inquiry.dto.InquiryDetailResponse;
import com.example.moduche.domain.inquiry.dto.InquiryListItemResponse;

import java.time.format.DateTimeFormatter;

public class InquiryMapper {

    private static final DateTimeFormatter F =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    /* ----------------------------------------------------
       목록 DTO 변환
    ----------------------------------------------------- */
    public static InquiryListItemResponse toListItem(Inquiry inq) {

        InquiryListItemResponse dto = new InquiryListItemResponse();
        dto.setInquiryId(inq.getInquiryId());
        dto.setTitle(inq.getTitle());

        // previewContent 30자 제한
        String preview = inq.getContent();
        if (preview != null && preview.length() > 30) {
            preview = preview.substring(0, 30) + "...";
        }
        dto.setPreviewContent(preview);

        dto.setCategory(inq.getCategory().name());
        dto.setStatus(inq.getStatus().name());
        dto.setSecret(inq.isSecret());   // ← boolean secret 그대로
        dto.setCreatedAt(
                inq.getCreatedAt() != null ? inq.getCreatedAt().format(F) : null
        );

        return dto;
    }

    /* ----------------------------------------------------
       상세 DTO 변환
    ----------------------------------------------------- */
    public static InquiryDetailResponse toDetailResponse(Inquiry inq) {

        InquiryDetailResponse dto = new InquiryDetailResponse();

        dto.setInquiryId(inq.getInquiryId());
        dto.setUsername(inq.getUsername());
        dto.setTitle(inq.getTitle());
        dto.setContent(inq.getContent());
        dto.setCategory(inq.getCategory().name());
        dto.setStatus(inq.getStatus().name());
        dto.setSecret(inq.isSecret());
        dto.setCreatedAt(
                inq.getCreatedAt() != null ? inq.getCreatedAt().format(F) : null
        );

        // 답변 매핑
        InquiryAnswer ans = inq.getAnswer();
        if (ans != null) {
            InquiryDetailResponse.AnswerDto a = new InquiryDetailResponse.AnswerDto();
            a.setAnswerId(ans.getAnswerId());
            a.setContent(ans.getContent());
            a.setAnsweredByUsername(ans.getAnsweredByUsername());

            a.setCreatedAt(
                    ans.getCreatedAt() != null ? ans.getCreatedAt().format(F) : null
            );

            dto.setAnswer(a);
        } else {
            dto.setAnswer(null);
        }

        return dto;
    }
}
