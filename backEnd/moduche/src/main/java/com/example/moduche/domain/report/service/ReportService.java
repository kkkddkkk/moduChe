package com.example.moduche.domain.report.service;

import com.example.moduche.domain.community.repository.CommunityCommentRepository;
import com.example.moduche.domain.community.repository.CommunityPostRepository;
import com.example.moduche.domain.login.User;
import com.example.moduche.repository.UserRepository;
import com.example.moduche.domain.report.Report;
import com.example.moduche.domain.report.dto.ReportCreateRequest;
import com.example.moduche.domain.report.dto.ReportDto;
import com.example.moduche.domain.report.enums.ReportStatus;
import com.example.moduche.domain.report.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportService {

    private final ReportRepository reportRepository;
    private final CommunityCommentRepository commentRepository;
    private final CommunityPostRepository postRepository;
    private final UserRepository userRepository;

    /** 신고 생성 */
    public ReportDto create(ReportCreateRequest req, String username) {

        User reporter = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

        Report report = new Report();
        report.setReporter(reporter);
        report.setTargetType(req.getTargetType());
        report.setTargetId(req.getTargetId());
        report.setReasonCode(req.getReasonCode());
        report.setReasonDetail(req.getReasonDetail());

        // 🔥 enum 사용
        report.setStatus(ReportStatus.PENDING);

        reportRepository.save(report);

        return ReportDto.from(report, createTargetSummary(report));
    }

    /** 전체 조회 */
    public List<ReportDto> getAll() {
        return reportRepository.findAllFetch()
                .stream()
                .map(r -> ReportDto.from(r, createTargetSummary(r)))
                .toList();
    }

    /** 상세 조회 */
    public ReportDto getDetail(Long id) {
        Report r = reportRepository.findByIdFetch(id);
        if (r == null) throw new RuntimeException("해당 신고 없음");
        return ReportDto.from(r, createTargetSummary(r));
    }

    /** 상태 변경 */
    public ReportDto updateStatus(Long id, ReportStatus status) {
        Report r = reportRepository.findByIdFetch(id);
        if (r == null) throw new RuntimeException("해당 신고 없음");

        // 🔥 enum 적용
        r.setStatus(status);

        return ReportDto.from(r, createTargetSummary(r));
    }

    /** 대상 요약 생성 */
    private String createTargetSummary(Report r) {
        return switch (r.getTargetType()) {

            case "COMMENT" -> commentRepository.findById(r.getTargetId())
                    .map(c -> "댓글: " + shorten(c.getContent()))
                    .orElse("(삭제된 댓글)");

            case "POST" -> postRepository.findById(r.getTargetId())
                    .map(p -> "게시글: " + shorten(p.getTitle()))
                    .orElse("(삭제된 게시글)");

            case "USER" -> "(사용자 신고)";

            default -> "(알 수 없음)";
        };
    }

    private String shorten(String t) {
        if (t == null) return "(내용 없음)";
        return t.length() <= 30 ? t : t.substring(0, 30) + "...";
    }
}
