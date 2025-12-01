package com.example.moduche.domain.dashboard.service;

import com.example.moduche.domain.dashboard.dto.DashboardSummaryDto;
import com.example.moduche.domain.dashboard.dto.DashboardTrendDto;
import com.example.moduche.domain.payment.enums.PaymentStatus;
import com.example.moduche.domain.payment.repository.PaymentRepository;
import com.example.moduche.repository.UserRepository;
import com.example.moduche.domain.report.repository.ReportRepository;
import com.example.moduche.domain.community.repository.CommunityRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final ReportRepository reportRepository;
    private final CommunityRepository communityRepository;

    public DashboardSummaryDto getSummary() {

        Long totalUsers = userRepository.count();

        Long newUsersToday = userRepository.countByCreatedAtBetween(
                LocalDate.now().atStartOfDay(),
                LocalDate.now().plusDays(1).atStartOfDay()
        );

        Long totalRevenue = paymentRepository.sumTotalPayments(PaymentStatus.PAID.name());

        Long pendingClubs = communityRepository.countPendingClubs();
        Long pendingReports = reportRepository.countPendingReports();

        return new DashboardSummaryDto(
                totalUsers,
                newUsersToday,
                totalRevenue,
                pendingClubs,
                pendingReports
        );
    }

    public DashboardTrendDto getTrend() {

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MM-dd");

        List<DashboardTrendDto.RevenueTrend> revenueTrend = new ArrayList<>();
        List<DashboardTrendDto.UserTrend> userTrend = new ArrayList<>();

        LocalDateTime start = LocalDate.now().minusDays(6).atStartOfDay();

        List<Object[]> rows =
                paymentRepository.sumDailyPayments(start, PaymentStatus.PAID.name());

        Map<LocalDate, Long> paymentMap = new HashMap<>();

        for (Object[] row : rows) {
            LocalDate date = ((Date) row[0]).toLocalDate();
            Long amount = ((Number) row[1]).longValue();
            paymentMap.put(date, amount);
        }

        for (int i = 6; i >= 0; i--) {

            LocalDate day = LocalDate.now().minusDays(i);
            String dateKey = day.format(fmt);

            Long amount = paymentMap.getOrDefault(day, 0L);
            revenueTrend.add(new DashboardTrendDto.RevenueTrend(dateKey, amount));

            Long newUsers = userRepository.countByCreatedAtBetween(
                    day.atStartOfDay(),
                    day.plusDays(1).atStartOfDay()
            );

            userTrend.add(new DashboardTrendDto.UserTrend(dateKey, newUsers));
        }

        return new DashboardTrendDto(revenueTrend, userTrend);
    }
}
