import React, { useMemo, useState, useEffect } from "react";
import {
    Grid, Card, CardContent, Typography, Stack, Divider,
    useTheme, Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, BarChart, Bar,
} from "recharts";

import { getDashboardSummary, getDashboardTrend } from "../../api/dashboard/dashboardApi";
import Paper from "../../component/common/Paper";

// 숫자 포맷
function formatNumber(n) {
    if (n === null || n === undefined) return "-";
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function DashboardPage() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [summary, setSummary] = useState({
        totalUsers: 0,
        newUsersToday: 0,
        totalRevenue: 0,
        pendingClubs: 0,
        pendingReports: 0,
    });

    const [trend, setTrend] = useState({
        revenue: [],
        newUsers: [],
    });

    // API 호출
    const loadDashboard = async () => {
        try {
            const summaryData = await getDashboardSummary();
            setSummary(summaryData);

            const trendData = await getDashboardTrend();

            // 🔥 변환 필수: 백엔드 → 프론트가 사용하는 구조로 바꿔줌
            setTrend({
                revenue: trendData.revenueTrend.map((item) => ({
                    date: item.date,
                    amount: item.amount,
                })),
                newUsers: trendData.userTrend.map((item) => ({
                    date: item.date,
                    newUsers: item.count,
                })),
            });

        } catch (e) {
            console.error("대시보드 데이터 로드 실패:", e);
        }
    };


    useEffect(() => {
        loadDashboard();
    }, []);

    // KPI 카드 리스트
    const summaryList = useMemo(
        () => [
            {
                label: "전체 이용자 수",
                value: formatNumber(summary.totalUsers),
                sub: `오늘 신규 ${summary.newUsersToday}명`,
                color: theme.palette.primary.main,
                path: "/admin/members",
            },
            {
                label: "누적 참여 결제액",
                value: formatNumber(summary.totalRevenue) + "원",
                sub: "참여 프로그램 결제 기준",
                color: theme.palette.success.main,
                path: "/admin/calculate",
            },
            {
                label: "승인 대기 동아리",
                value: summary.pendingClubs + "건",
                sub: "심사 필요",
                color: theme.palette.warning.main,
                path: "/admin/club-approval",
            },
            {
                label: "미처리 신고",
                value: summary.pendingReports + "건",
                sub: "신속 조치 필요",
                color: theme.palette.error.main,
                path: "/admin/reports",
            },
        ],
        [summary, theme]
    );

    // 그래프 y축 포맷
    const moneyTickFormatter = (v) => `${formatNumber(v)}`;
    const userTickFormatter = (v) => `${v}`;

    return (
        <Paper
            sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                boxShadow: 0,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
            }}
        >
            {/* 헤더 */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                        lineHeight: 1.3,
                        color: "primary.main",
                        mb: 1,
                        textAlign: { xs: "left", sm: "center" },
                    }}
                >
                    운영 대시보드
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        maxWidth: 600,
                        mx: { xs: 0, sm: "auto" },
                        lineHeight: 1.5,
                        textAlign: { xs: "left", sm: "center" },
                    }}
                >
                    이용자, 결제 참여, 신고/승인 현황을 한눈에 확인할 수 있습니다.
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* KPI 카드 영역 */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(4, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                {summaryList.map((item, idx) => (
                    <Card
                        key={idx}
                        onClick={() => item.path && navigate(item.path)}
                        sx={{
                            borderRadius: 2,
                            boxShadow: 1,
                            border: "1px solid",
                            borderColor: "divider",
                            display: "flex",
                            flexDirection: "row",
                            cursor: item.path ? "pointer" : "default",
                            transition: "0.2s",
                            "&:hover": item.path
                                ? {
                                      transform: "translateY(-4px)",
                                      boxShadow: 3,
                                  }
                                : undefined,
                        }}
                    >
                        <Box sx={{ width: 6, bgcolor: item.color }} />

                        <CardContent sx={{ flexGrow: 1, py: 2, px: 2 }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight={500}
                                gutterBottom
                            >
                                {item.label}
                            </Typography>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                                sx={{ lineHeight: 1.2 }}
                            >
                                {item.value}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block", mt: 1 }}
                            >
                                {item.sub}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* 그래프 영역 */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(2, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                {/* 결제 추이 */}
                <Card
                    sx={{
                        borderRadius: 2,
                        boxShadow: 1,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <CardContent sx={{ flexGrow: 1, minHeight: 260 }}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            sx={{ mb: 2 }}
                        >
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                    color="text.secondary"
                                >
                                    최근 7일 결제 금액
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    일별 프로그램·강좌 결제액(원)
                                </Typography>
                            </Box>
                        </Stack>

                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={trend.revenue}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={theme.palette.divider}
                                />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis
                                    tickFormatter={moneyTickFormatter}
                                    tick={{ fontSize: 12 }}
                                />
                                <RechartsTooltip
                                    formatter={(v) =>
                                        `${formatNumber(v)} 원`
                                    }
                                />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke={theme.palette.primary.main}
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 신규 가입자 추이 */}
                <Card
                    sx={{
                        borderRadius: 2,
                        boxShadow: 1,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <CardContent sx={{ flexGrow: 1, minHeight: 260 }}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            sx={{ mb: 2 }}
                        >
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                    color="text.secondary"
                                >
                                    최근 7일 신규 가입자
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    일별 가입자 수
                                </Typography>
                            </Box>
                        </Stack>

                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={trend.newUsers}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={theme.palette.divider}
                                />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={userTickFormatter}
                                />
                                <RechartsTooltip
                                    formatter={(v) => `${v} 명`}
                                />
                                <Bar
                                    dataKey="newUsers"
                                    fill={theme.palette.success.main}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Box>

            {/* 운영 상태 요약 */}
            <Card
                sx={{
                    borderRadius: 2,
                    boxShadow: 1,
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <CardContent>
                    <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        color="text.secondary"
                        gutterBottom
                    >
                        운영 상태 요약
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="body2" fontWeight={600}>
                                처리 대기 신고
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ lineHeight: 1.5 }}
                            >
                                아직 처리되지 않은 신고가{" "}
                                <b>{summary.pendingReports}건</b> 있습니다.
                                <br />
                                “신고 관리”에서 게시글/댓글을 블라인드하거나
                                삭제할 수 있습니다.
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="body2" fontWeight={600}>
                                승인 대기 동아리
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ lineHeight: 1.5 }}
                            >
                                신규 동아리 신청{" "}
                                <b>{summary.pendingClubs}건</b>이 대기 중입니다.
                                <br />
                                승인 시 이용자들에게 추천됩니다.
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="body2" fontWeight={600}>
                                운영 메모
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ lineHeight: 1.5 }}
                            >
                                메인 화면 상단 추천 영역은 “추천 프로그램 노출 관리”에서 변경할 수 있습니다.
                                <br />
                                센터/시설 정보는 “시설 관리”에서 최신화해 주세요.
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Paper>
    );
}
