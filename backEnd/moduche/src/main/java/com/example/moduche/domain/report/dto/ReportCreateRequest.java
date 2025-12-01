package com.example.moduche.domain.report.dto;

import lombok.Data;

@Data
public class ReportCreateRequest {
    private String targetType;
    private Long targetId;
    private String reasonCode;
    private String reasonDetail;
}
