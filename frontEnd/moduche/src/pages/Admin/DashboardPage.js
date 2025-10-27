// src/pages/Admin/DashboardPage.js
import React, { useMemo } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Stack,
    Divider,
    useTheme,
} from "@mui/material";

// recharts
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";

import Paper from "../../component/common/Paper";

/** ---------------------------
 * 더미 데이터 (나중에 API 연동)
 * -------------------------- */
const dummySummary = {
    totalUsers: 1287,        // 전체 가입자 수
    newUsersToday: 14,       // 오늘 신규 가입자
    totalRevenue: 53200000,  // 누적 정산 금액 (원)
    pendingClubs: 5,         // 승인 대기 동호회 수
    pendingReports: 12,      // 미처리 신고 수
};

// 최근 7일 정산 금액 (원)
const dummyRevenueTrend = [
    { date: "10-18", amount: 3200000 },
    { date: "10-19", amount: 2100000 },
    { date: "10-20", amount: 4500000 },
    { date: "10-21", amount: 3800000 },
    { date: "10-22", amount: 5200000 },
    { date: "10-23", amount: 6100000 },
    { date: "10-24", amount: 4700000 },
];

// 최근 7일 신규 가입자 수
const dummyUserTrend = [
    { date: "10-18", newUsers: 8 },
    { date: "10-19", newUsers: 5 },
    { date: "10-20", newUsers: 11 },
    { date: "10-21", newUsers: 9 },
    { date: "10-22", newUsers: 12 },
    { date: "10-23", newUsers: 10 },
    { date: "10-24", newUsers: 14 },
];

/** 숫자 포맷: 53200000 -> "53,200,000" */
function formatNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function DashboardPage() {
    const theme = useTheme();

    // 상단 KPI 카드에 뿌릴 데이터
    const summaryList = useMemo(
        () => [
            {
                label: "전체 회원 수",
                value: formatNumber(dummySummary.totalUsers),
                sub: `오늘 신규 ${dummySummary.newUsersToday}명`,
                color: theme.palette.primary.main,
            },
            {
                label: "누적 정산 금액",
                value: formatNumber(dummySummary.totalRevenue) + "원",
                sub: "VAT 제외 가정",
                color: theme.palette.success.main,
            },
            {
                label: "동호회 승인 대기",
                value: dummySummary.pendingClubs + "건",
                sub: "심사 필요",
                color: theme.palette.warning.main,
            },
            {
                label: "미처리 신고",
                value: dummySummary.pendingReports + "건",
                sub: "신속 조치 필요",
                color: theme.palette.error.main,
            },
        ],
        [theme]
    );

    // Y축 포맷
    const moneyTickFormatter = (v) => `${formatNumber(v)}`;
    const userTickFormatter = (v) => `${v}`;

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "1400px",
                mx: "auto",
            }}
        >
            {/* 바깥을 감싸는 큰 카드(=페이지 전체 카드) */}
            <Paper
                sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                boxShadow: 1,
            }}
            >
                {/* 상단 헤더 / 안내 영역 */}
                <Box sx={{ textAlign: "center", mb: 3 }}>
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
                        sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.5 }}
                    >
                        서비스 운영 현황을 한눈에 확인할 수 있습니다.
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* KPI 카드 4개 */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {summaryList.map((item, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={idx}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "stretch",
                                    overflow: "hidden",
                                }}
                            >
                                {/* 왼쪽 컬러 바 */}
                                <Box
                                    sx={{
                                        width: 6,
                                        bgcolor: item.color,
                                    }}
                                />
                                <CardContent
                                    sx={{
                                        flexGrow: 1,
                                        py: 2,
                                        px: 2,
                                    }}
                                >
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
                        </Grid>
                    ))}
                </Grid>

                {/* 그래프 2개 영역 */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {/* 정산 추이 */}
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                borderRadius: 2,
                                boxShadow: 1,
                                border: "1px solid",
                                borderColor: "divider",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
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
                                            최근 7일 정산 금액
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            일별 정산액(원)
                                        </Typography>
                                    </Box>
                                </Stack>

                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={dummyRevenueTrend}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke={theme.palette.divider}
                                        />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            tickFormatter={
                                                moneyTickFormatter
                                            }
                                            tick={{ fontSize: 12 }}
                                        />
                                        <RechartsTooltip
                                            formatter={(val) =>
                                                `${formatNumber(val)} 원`
                                            }
                                            labelFormatter={(label) =>
                                                `${label} 매출`
                                            }
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="amount"
                                            stroke={
                                                theme.palette.primary.main
                                            }
                                            strokeWidth={2}
                                            dot={{ r: 3 }}
                                            name="일별 정산액"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* 신규 가입자 추이 */}
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                borderRadius: 2,
                                boxShadow: 1,
                                border: "1px solid",
                                borderColor: "divider",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
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

                                <ResponsiveContainer
                                    width="100%"
                                    height={200}
                                >
                                    <BarChart data={dummyUserTrend}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke={
                                                theme.palette.divider
                                            }
                                        />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            allowDecimals={false}
                                            tickFormatter={
                                                userTickFormatter
                                            }
                                            tick={{ fontSize: 12 }}
                                        />
                                        <RechartsTooltip
                                            formatter={(val) =>
                                                `${val} 명`
                                            }
                                            labelFormatter={(label) =>
                                                `${label} 가입자`
                                            }
                                        />
                                        <Bar
                                            dataKey="newUsers"
                                            name="신규 가입자"
                                            fill={
                                                theme.palette.success.main
                                            }
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

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

                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                >
                                    처리 대기 신고
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.5 }}
                                >
                                    아직 처리되지 않은 신고가{" "}
                                    <b>{dummySummary.pendingReports}건</b>{" "}
                                    있습니다.
                                    <br />
                                    “신고 관리”에서 해당 댓글/게시글을
                                    즉시 블라인드하거나 삭제할 수
                                    있습니다.
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                >
                                    승인 대기 동호회
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.5 }}
                                >
                                    신규 동호회 신청{" "}
                                    <b>{dummySummary.pendingClubs}건</b>이
                                    대기 중입니다.
                                    <br />
                                    승인 시 서비스에 노출됩니다.
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                >
                                    시스템 메모
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.5 }}
                                >
                                    공지사항 고정은 상단에 노출됩니다.
                                    <br />
                                    배너 관리에서 광고/프로모션 노출
                                    여부를 조정할 수 있습니다.
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Paper>
        </Box>
    );
}
