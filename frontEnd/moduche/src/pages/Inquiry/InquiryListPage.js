// src/pages/Inquiry/InquiryListPage.js

import React, { useState, useMemo, useEffect } from "react";
import {
    Box,
    Stack,
    TextField,
    InputAdornment,
    Chip,
    Pagination,
    Typography,
    alpha,
    useTheme,
    Paper as MuiPaper,
    Tabs,
    Tab,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Paper from "../../component/common/Paper";
import { OneAlignedButton } from "../../component/common/Button";
import { Contents } from "../../component/common/Text";
import { OutlinedSelect } from "../../component/common/CustomSelect";

import { fetchInquiries } from "../../api/inquiryApi/inquiryPublicApi";
import { fetchMyInquiries } from "../../api/inquiryApi/inquiryUserApi";

import InquiryDetailCard from "./InquiryDetailCard";

import { useSearchParams } from "react-router-dom";

// ---------------------------------
// 날짜 변환 함수 (위치 이동)
// ---------------------------------
const safeDate = (dt) => {
    if (!dt) return "-";
    try {
        return dt.replace("T", " ").slice(0, 16);
    } catch {
        return dt;
    }
};

export default function InquiryListPage() {
    const theme = useTheme();

    const [searchParams] = useSearchParams();
    const queryTab = searchParams.get("tab");

    // 🔥 URL 파라미터 기반 초기 탭 설정
    const [tab, setTab] = useState(queryTab === "my" ? "my" : "all");

    const handleTabChange = (_, v) => {
        setTab(v);
        setPage(1);
        setOpenedId(null);
    };

    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [openedId, setOpenedId] = useState(null);

    const [searchType, setSearchType] = useState("title");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [sortOption, setSortOption] = useState("latest");

    const rowsPerPage = 5;
    const [inquiries, setInquiries] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    // 🔥 전체 또는 내 문의 자동 조회
    useEffect(() => {
        const load = async () => {
            try {
                let res;

                if (tab === "all") {
                    res = await fetchInquiries({
                        page: page - 1,
                        size: rowsPerPage,
                    });
                } else {
                    res = await fetchMyInquiries({
                        page: page - 1,
                        size: rowsPerPage,
                    });
                }

                const content = Array.isArray(res.content) ? res.content : [];

                console.log("LIST RESPONSE RAW:", JSON.stringify(content, null, 2));

                setInquiries(
                    content.map((q) => ({
                        inquiryId: q.inquiryId,
                        title: q.title,
                        status: q.status,
                        createdAt: safeDate(q.createdAt),
                        secret: q.secret,
                        category: q.category,
                    }))
                );

                setTotalPages(res.totalPages ?? 1);
            } catch (err) {
                console.error("문의 목록 로드 실패:", err);
            }
        };

        load();
    }, [page, tab]);

    // --------------------------------------
    // 검색 / 상태 필터 / 정렬
    // --------------------------------------
    const STATUS_TEXT = { WAIT: "답변 대기", ANSWERED: "답변 완료" };
    const STATUS_COLOR = { WAIT: "warning", ANSWERED: "success" };

    const filtered = useMemo(() => {
        let list = [...inquiries];

        const kw = keyword.trim().toLowerCase();

        if (kw.length > 0) {
            list = list.filter((q) =>
                (q.title || "").toLowerCase().includes(kw)
            );
        }

        if (statusFilter !== "ALL") {
            list = list.filter((q) => q.status === statusFilter);
        }

        if (sortOption === "latest") {
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else {
            list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        return list;
    }, [inquiries, keyword, searchType, statusFilter, sortOption]);

    // --------------------------------------
    // UI 렌더링
    // --------------------------------------
    return (
        <Box sx={{ width: "100%", px: 2, mt: 4 }}>
            {/* 제목 */}
            <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
                문의하기
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
                sx={{ mb: 3 }}
            >
                궁금한 점이나 불편 사항을 자유롭게 문의해주세요.
            </Typography>

            {/* 🔥 탭 */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    centered
                    sx={{
                        "& .MuiTab-root": {
                            fontWeight: 600,
                            fontSize: "1rem",
                        },
                    }}
                    TabIndicatorProps={{
                        style: { backgroundColor: theme.palette.primary.main, height: 3 },
                    }}
                >
                    <Tab value="all" label="전체 문의" />
                    <Tab value="my" label="내 문의" />
                </Tabs>
            </Box>

            {/* 검색 / 필터 */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <MuiPaper
                    elevation={2}
                    sx={{
                        p: 3,
                        mb: 3,
                        width: "65%",
                        borderRadius: 3,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${alpha("#000", 0.1)}`,
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        {/* 검색 기준 */}
                        <Box sx={{ width: 140 }}>
                            <OutlinedSelect
                                padding={10}
                                size={14}
                                selected={searchType}
                                setSelected={setSearchType}
                                data={[{ value: "title", label: "제목" }]}
                                format={(d) => d.label}
                            />
                        </Box>

                        {/* 상태 필터 */}
                        <Box sx={{ width: 140 }}>
                            <OutlinedSelect
                                padding={10}
                                size={14}
                                selected={statusFilter}
                                setSelected={setStatusFilter}
                                data={[
                                    { value: "ALL", label: "전체" },
                                    { value: "WAIT", label: "답변 대기" },
                                    { value: "ANSWERED", label: "답변 완료" },
                                ]}
                                format={(d) => d.label}
                            />
                        </Box>

                        {/* 정렬 */}
                        <Box sx={{ width: 140 }}>
                            <OutlinedSelect
                                padding={10}
                                size={14}
                                selected={sortOption}
                                setSelected={setSortOption}
                                data={[
                                    { value: "latest", label: "최신순" },
                                    { value: "oldest", label: "오래된순" },
                                ]}
                                format={(d) => d.label}
                            />
                        </Box>

                        {/* 검색창 */}
                        <Box sx={{ flexGrow: 1 }}>
                            <TextField
                                size="small"
                                placeholder="검색어 입력"
                                value={keyword}
                                onChange={(e) => {
                                    setKeyword(e.target.value);
                                    setPage(1);
                                }}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        {/* 새 문의 */}
                        <Box sx={{ flexShrink: 0 }}>
                            <OneAlignedButton
                                align="right"
                                buttonWrapperSx={{ width: 160 }}
                                onClick={() => (window.location.href = "/inquiry/new")}
                            >
                                새 문의 작성
                            </OneAlignedButton>
                        </Box>
                    </Stack>
                </MuiPaper>
            </Box>

            {/* 리스트 */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Stack spacing={2} sx={{ width: "65%" }}>
                    {filtered.length === 0 ? (
                        <Paper padding={4} elevation={0} sx={{ textAlign: "center" }}>
                            <Contents color="text.secondary">
                                등록된 문의가 없습니다.
                            </Contents>
                        </Paper>
                    ) : (
                        filtered.map((item) => (
                            <React.Fragment key={item.inquiryId}>
                                <Paper
                                    padding={2}
                                    elevation={1}
                                    hoverable
                                    sx={{
                                        borderRadius: 3,
                                        border: `1px solid ${alpha(
                                            theme.palette.primary.main,
                                            0.15
                                        )}`,
                                        cursor: "pointer",
                                    }}
                                    onClick={() =>
                                        setOpenedId(
                                            openedId === item.inquiryId ? null : item.inquiryId
                                        )
                                    }
                                >
                                    <Stack direction="row" justifyContent="space-between">
                                        <Box>
                                            <Contents bold fontSize={17} sx={{ mb: 1 }}>
                                                {item.title}
                                            </Contents>

                                            <Stack direction="row" spacing={1}>
                                                <Chip
                                                    size="small"
                                                    label={STATUS_TEXT[item.status]}
                                                    color={STATUS_COLOR[item.status]}
                                                />
                                                <Contents fontSize={14} color="text.secondary">
                                                    {item.createdAt}
                                                </Contents>
                                            </Stack>
                                        </Box>

                                        {openedId === item.inquiryId ? (
                                            <ExpandMoreIcon sx={{ color: "text.disabled" }} />
                                        ) : (
                                            <ArrowForwardIosIcon sx={{ color: "text.disabled" }} />
                                        )}
                                    </Stack>
                                </Paper>

                                {openedId === item.inquiryId && (
                                    <InquiryDetailCard key={item.inquiryId} id={item.inquiryId} />
                                )}
                            </React.Fragment>
                        ))
                    )}
                </Stack>
            </Box>

            {/* 페이지네이션 */}
            <Stack direction="row" justifyContent="center" sx={{ mt: 5, mb: 5 }}>
                <Pagination
                    page={page}
                    count={Math.max(totalPages, 1)}
                    onChange={(_, v) => setPage(v)}
                    color="primary"
                    size="medium"
                />
            </Stack>
        </Box>
    );
}
