package com.example.moduche.domain.report.dto;

import com.example.moduche.domain.report.Report;
import com.example.moduche.domain.report.enums.ReportStatus;
import lombok.Data;

import java.time.format.DateTimeFormatter;

@Data
public class ReportDto {

    private Long reportId;

    private String reporterName;
    private String reporterEmail;

    private String targetType;
    private Long targetId;
    private String targetSummary;

    private String reason;
    private String reasonDetail;

    private String status;

    private String reportedAt;
    private String resolvedAt;

    private String adminMemo;

    private static final DateTimeFormatter fmt =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static ReportDto from(Report r, String targetSummary) {
        ReportDto dto = new ReportDto();

        dto.setReportId(r.getReportId());
        dto.setReporterName(r.getReporter().getName());
        dto.setReporterEmail(r.getReporter().getEmail());

        dto.setTargetType(r.getTargetType());
        dto.setTargetId(r.getTargetId());
        dto.setTargetSummary(targetSummary != null ? targetSummary : "");

        dto.setReason(r.getReasonCode());
        dto.setReasonDetail(r.getReasonDetail());

        // 🔥 enum 을 String으로 변환
        dto.setStatus(r.getStatus().name());

        // 생성일
        dto.setReportedAt(
                r.getCreatedAt() != null ? r.getCreatedAt().format(fmt) : null
        );

        // 🔥 처리 완료/기각일 때만 updatedAt 표시
        if (r.getStatus() == ReportStatus.RESOLVED || r.getStatus() == ReportStatus.REJECTED) {
            dto.setResolvedAt(
                    r.getUpdatedAt() != null ? r.getUpdatedAt().format(fmt) : null
            );
        } else {
            dto.setResolvedAt(null);
        }

        dto.setAdminMemo(null);
        return dto;
    }
}
