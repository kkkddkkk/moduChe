package com.example.moduche.domain.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DashboardTrendDto {

    private List<RevenueTrend> revenueTrend;
    private List<UserTrend> userTrend;

    @Data
    @AllArgsConstructor
    public static class RevenueTrend {
        private String date;
        private Long amount;
    }

    @Data
    @AllArgsConstructor
    public static class UserTrend {
        private String date;
        private Long count;
    }
}
