package com.example.moduche.domain.report.repository;

import com.example.moduche.domain.report.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    /** 전체 신고 리스트 + reporter/handler 즉시 로딩 */
    @Query("""
        select r from Report r
        join fetch r.reporter
        left join fetch r.handler
        order by r.createdAt desc
    """)
    List<Report> findAllFetch();

    /** 단일 신고 상세 조회 + reporter/handler 즉시 로딩 */
    @Query("""
        select r from Report r
        join fetch r.reporter
        left join fetch r.handler
        where r.reportId = :id
    """)
    Report findByIdFetch(@Param("id") Long id);
    
 // 대시보드용: 미처리 신고 수
    long countByStatus(com.example.moduche.domain.report.enums.ReportStatus status);

    default long countPendingReports() {
        return countByStatus(com.example.moduche.domain.report.enums.ReportStatus.PENDING);
    }

}
