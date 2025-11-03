// src/pages/Admin/FacilityPage.js
import React, { useState, useMemo, useEffect } from "react";
import {
    Box,
    Typography,
    Stack,
    IconButton,
    Tooltip,
    TextField,
    MenuItem,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Pagination,
    InputAdornment,
    Button,
    Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from "@mui/icons-material/AddBusiness";

import Paper from "../../component/common/Paper";

/**
 * 더미 데이터 예시 설명
 * - fid: 내부 시설 ID
 * - name: 시설명
 * - city: 지역/권역
 * - category: 시설 유형 (재활센터 / 수중치료 / 체육관 / 커뮤니티)
 * - accessibility: 접근성(휠체어 가능, 엘리베이터 있음 등)
 * - status: 모집 상태 / 운영 상태
 * - createdAt: 등록일
 */
const DUMMY_FACILITIES = [
    {
        fid: "FAC-0001",
        name: "한빛 재활 스포츠센터",
        city: "서울 강서구",
        category: "REHAB_CENTER",
        accessibility: "휠체어 가능",
        status: "ACTIVE",
        createdAt: "2025-08-12 09:10",
    },
    {
        fid: "FAC-0002",
        name: "부산 수중 재활클리닉",
        city: "부산 해운대구",
        category: "AQUA_THERAPY",
        accessibility: "리프트 지원",
        status: "RECRUITING",
        createdAt: "2025-09-03 14:22",
    },
    {
        fid: "FAC-0003",
        name: "대전 휠체어 농구 체육관",
        city: "대전 유성구",
        category: "SPORTS_GYM",
        accessibility: "경사로 / 전용 주차",
        status: "PAUSED",
        createdAt: "2025-10-01 11:40",
    },
];

// 라벨 매핑
const CATEGORY_LABEL = {
    REHAB_CENTER: "재활 센터",
    AQUA_THERAPY: "수중 재활",
    SPORTS_GYM: "장애인 체육관",
    COMMUNITY_SPACE: "커뮤니티 센터",
};

const STATUS_LABEL = {
    ACTIVE: "운영 중",
    RECRUITING: "신규 모집 중",
    PAUSED: "일시 중단",
};

const STATUS_COLOR = {
    ACTIVE: "success",
    RECRUITING: "warning",
    PAUSED: "default",
};

function FacilityPage() {
    // 데이터 상태
    const [list, setList] = useState(DUMMY_FACILITIES);

    // 필터 상태
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [cityFilter, setCityFilter] = useState("ALL");
    const [categoryFilter, setCategoryFilter] = useState("ALL");

    // 페이지네이션
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    // 액션 핸들러
    const handleRefresh = () => {
        console.log("🔄 시설 목록 새로고침 (API)");
    };

    const handleExport = () => {
        console.log("⬇ 시설 목록 다운로드 (엑셀/CSV)");
    };

    const handleCreateFacility = () => {
        console.log("🏗 새 시설 등록 모달 오픈");
    };

    const handleView = (fid) => {
        console.log("👁 시설 상세 보기:", fid);
    };

    // 필터링 로직
    const filteredList = useMemo(() => {
        const kw = keyword.trim().toLowerCase();

        return list.filter((row) => {
            // 검색: 시설명 / 시설ID / 지역(= city)
            const matchKeyword =
                kw === "" ||
                row.name.toLowerCase().includes(kw) ||
                row.city.toLowerCase().includes(kw) ||
                row.fid.toLowerCase().includes(kw);

            const matchStatus =
                statusFilter === "ALL" ? true : row.status === statusFilter;

            const matchCity =
                cityFilter === "ALL" ? true : row.city.includes(cityFilter);

            const matchCategory =
                categoryFilter === "ALL"
                    ? true
                    : row.category === categoryFilter;

            return (
                matchKeyword &&
                matchStatus &&
                matchCity &&
                matchCategory
            );
        });
    }, [list, keyword, statusFilter, cityFilter, categoryFilter]);

    // 현재 페이지 데이터
    const pagedList = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredList.slice(start, start + rowsPerPage);
    }, [filteredList, page]);

    const pageCount = Math.ceil(filteredList.length / rowsPerPage) || 1;

    // 필터가 바뀌면 페이지 리셋
    useEffect(() => {
        setPage(1);
    }, [keyword, statusFilter, cityFilter, categoryFilter, list]);

    // 통계
    const activeCount = useMemo(() => {
        return filteredList.filter((f) => f.status === "ACTIVE").length;
    }, [filteredList]);

    const recruitingCount = useMemo(() => {
        return filteredList.filter((f) => f.status === "RECRUITING").length;
    }, [filteredList]);

    return (
        <Paper
            sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                boxShadow: 1,
            }}
        >
            {/* 1. 상단 영역: 타이틀 / 설명 */}
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
                    시설 관리
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        lineHeight: 1.5,
                        textAlign: { xs: "left", sm: "center" },
                    }}
                >
                    장애인 맞춤 운동/재활 프로그램을 제공하는 센터, 체육관,
                    커뮤니티 공간 정보를 관리합니다.
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* 2. 옵션 바 */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    flexWrap: "wrap",
                    alignItems: { xs: "stretch", md: "center" },
                    justifyContent: "space-between",
                    rowGap: 2,
                    columnGap: 2,

                    p: 2,
                    mb: 2,

                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                    bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                            ? theme.palette.background.default
                            : theme.palette.grey[50],
                }}
            >
                {/* 왼쪽 필터 영역 */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        rowGap: 1.5,
                        columnGap: 1.5,
                        minWidth: 0,
                    }}
                >
                    {/* 상태 필터 */}
                    <TextField
                        select
                        label="상태"
                        size="small"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        sx={{
                            minWidth: 130,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                backgroundColor: "background.paper",
                                "& fieldset": {
                                    borderColor: "divider",
                                },
                                "&:hover fieldset": {
                                    borderColor: "primary.light",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "primary.main",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                fontSize: "0.75rem",
                            },
                        }}
                    >
                        <MenuItem value="ALL">전체</MenuItem>
                        <MenuItem value="ACTIVE">운영 중</MenuItem>
                        <MenuItem value="RECRUITING">신규 모집 중</MenuItem>
                        <MenuItem value="PAUSED">일시 중단</MenuItem>
                    </TextField>

                    {/* 지역 필터 */}
                    <TextField
                        select
                        label="지역"
                        size="small"
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        sx={{
                            minWidth: 140,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                backgroundColor: "background.paper",
                                "& fieldset": {
                                    borderColor: "divider",
                                },
                                "&:hover fieldset": {
                                    borderColor: "primary.light",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "primary.main",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                fontSize: "0.75rem",
                            },
                        }}
                    >
                        <MenuItem value="ALL">전체</MenuItem>
                        <MenuItem value="서울">서울</MenuItem>
                        <MenuItem value="부산">부산</MenuItem>
                        <MenuItem value="대전">대전</MenuItem>
                        <MenuItem value="기타">그 외 지역</MenuItem>
                    </TextField>

                    {/* 시설 유형 필터 */}
                    <TextField
                        select
                        label="시설 유형"
                        size="small"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        sx={{
                            minWidth: 150,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                backgroundColor: "background.paper",
                                "& fieldset": {
                                    borderColor: "divider",
                                },
                                "&:hover fieldset": {
                                    borderColor: "primary.light",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "primary.main",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                fontSize: "0.75rem",
                            },
                        }}
                    >
                        <MenuItem value="ALL">전체</MenuItem>
                        <MenuItem value="REHAB_CENTER">재활 센터</MenuItem>
                        <MenuItem value="AQUA_THERAPY">수중 재활</MenuItem>
                        <MenuItem value="SPORTS_GYM">장애인 체육관</MenuItem>
                        <MenuItem value="COMMUNITY_SPACE">
                            커뮤니티 공간
                        </MenuItem>
                    </TextField>

                    {/* 검색 */}
                    <TextField
                        size="small"
                        placeholder="시설명 / 시설ID / 지역 검색"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        sx={{
                            minWidth: { xs: "100%", md: 260 },
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 5, // 우리 검색 인풋 시그니처
                                backgroundColor: "background.paper",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                "& fieldset": {
                                    borderColor: "transparent",
                                },
                                "&:hover fieldset": {
                                    borderColor: "primary.light",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "primary.main",
                                },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon
                                        sx={{
                                            color: "text.disabled",
                                            fontSize: 20,
                                        }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* 오른쪽: 통계 + 액션 */}
                <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="wrap"
                    spacing={1.5}
                    sx={{
                        width: { xs: "100%", md: "auto" },
                        justifyContent: {
                            xs: "space-between",
                            md: "flex-end",
                        },
                    }}
                >
                    {/* 통계 */}
                    <Box sx={{ textAlign: "right", mr: 1 }}>
                        <Typography
                            sx={{
                                fontSize: "0.8rem",
                                color: "text.secondary",
                                fontWeight: 400,
                                whiteSpace: "nowrap",
                            }}
                        >
                            총 {filteredList.length}곳
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                color: "text.primary",
                            }}
                        >
                            운영 중 {activeCount}곳 · 모집 중 {recruitingCount}곳
                        </Typography>
                    </Box>

                    {/* 새 시설 등록 버튼 */}
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateFacility}
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            px: 1.5,
                            py: 1,
                            whiteSpace: "nowrap",
                        }}
                    >
                        새 시설 등록
                    </Button>

                    {/* 새로고침 */}
                    <Tooltip title="새로고침">
                        <IconButton
                            size="small"
                            onClick={handleRefresh}
                            sx={{
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                "&:hover": {
                                    bgcolor: "primary.main",
                                    color: "#fff",
                                    borderColor: "primary.main",
                                },
                                width: 32,
                                height: 32,
                            }}
                        >
                            <RefreshIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* 내보내기 */}
                    <Tooltip title="내보내기">
                        <IconButton
                            size="small"
                            onClick={handleExport}
                            sx={{
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                "&:hover": {
                                    bgcolor: "success.main",
                                    color: "#fff",
                                    borderColor: "success.main",
                                },
                                width: 32,
                                height: 32,
                            }}
                        >
                            <DownloadIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {/* 3. 테이블 */}
            <Box
                sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: 0,
                    maxHeight: 480,
                    overflow: "auto",
                    "&::-webkit-scrollbar": { width: 6, height: 6 },
                    "&::-webkit-scrollbar-thumb": {
                        bgcolor: "rgba(0,0,0,0.2)",
                        borderRadius: 3,
                    },
                }}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: (theme) =>
                                    theme.palette.mode === "dark"
                                        ? theme.palette.grey[900]
                                        : theme.palette.grey[100],
                                "& th": {
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                    fontSize: "0.8rem",
                                    color: "text.primary",
                                },
                            }}
                        >
                            <TableCell sx={{ minWidth: 110 }}>
                                시설ID
                            </TableCell>
                            <TableCell sx={{ minWidth: 160 }}>
                                시설명
                            </TableCell>
                            <TableCell sx={{ minWidth: 140 }}>
                                지역
                            </TableCell>
                            <TableCell sx={{ minWidth: 140 }}>
                                시설 유형
                            </TableCell>
                            <TableCell sx={{ minWidth: 140 }}>
                                접근성
                            </TableCell>
                            <TableCell sx={{ minWidth: 110 }}>
                                상태
                            </TableCell>
                            <TableCell sx={{ minWidth: 140 }}>
                                등록일
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{ minWidth: 80 }}
                            >
                                액션
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {pagedList.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    align="center"
                                    sx={{ py: 6, color: "text.secondary" }}
                                >
                                    조건에 맞는 시설이 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pagedList.map((row) => (
                                <TableRow
                                    key={row.fid}
                                    hover
                                    sx={{
                                        "&:last-of-type td": {
                                            borderBottom: 0,
                                        },
                                        transition:
                                            "background-color 0.15s ease-in-out",
                                        "&:hover": {
                                            backgroundColor:
                                                "rgba(0,0,0,0.03)",
                                        },
                                    }}
                                >
                                    {/* 시설ID */}
                                    <TableCell
                                        sx={{
                                            fontFamily: "monospace",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {row.fid}
                                    </TableCell>

                                    {/* 시설명 */}
                                    <TableCell
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {row.name}
                                    </TableCell>

                                    {/* 지역 */}
                                    <TableCell
                                        sx={{
                                            fontSize: "0.8rem",
                                            whiteSpace: "nowrap",
                                            color: "text.secondary",
                                        }}
                                    >
                                        {row.city}
                                    </TableCell>

                                    {/* 시설 유형 */}
                                    <TableCell>
                                        <Chip
                                            label={
                                                CATEGORY_LABEL[row.category] ||
                                                row.category
                                            }
                                            size="small"
                                            color={
                                                row.category ===
                                                "REHAB_CENTER"
                                                    ? "primary"
                                                    : "default"
                                            }
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: "0.7rem",
                                                px: 1,
                                            }}
                                        />
                                    </TableCell>

                                    {/* 접근성 */}
                                    <TableCell
                                        sx={{
                                            fontSize: "0.75rem",
                                            color: "text.secondary",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {row.accessibility}
                                    </TableCell>

                                    {/* 상태 */}
                                    <TableCell>
                                        <Chip
                                            label={STATUS_LABEL[row.status]}
                                            size="small"
                                            color={STATUS_COLOR[row.status]}
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: "0.7rem",
                                                px: 1,
                                            }}
                                        />
                                    </TableCell>

                                    {/* 등록일 */}
                                    <TableCell
                                        sx={{
                                            fontSize: "0.8rem",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {row.createdAt}
                                    </TableCell>

                                    {/* 액션 */}
                                    <TableCell align="right">
                                        <Tooltip title="상세 보기">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleView(row.fid)
                                                }
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Box>

            {/* 4. 페이지네이션 */}
            <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    size="small"
                    siblingCount={1}
                    boundaryCount={1}
                    showFirstButton
                    showLastButton
                />
            </Stack>
        </Paper>
    );
}

export default FacilityPage;
