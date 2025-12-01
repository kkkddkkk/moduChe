package com.example.moduche.domain.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardSummaryDto {
    private Long totalUsers;
    private Long newUsersToday;
    private Long totalRevenue;
    private Long pendingClubs;
    private Long pendingReports;
}
