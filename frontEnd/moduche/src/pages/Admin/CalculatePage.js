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

import Paper from "../../component/common/Paper";

// ---------------------- 더미 데이터 ----------------------
const DUMMY_SETTLEMENTS = [
    {
        sid: "S-202510-001",
        companyName: "더조은",
        businessNo: "123-45-67890",
        type: "BANNER_AD",
        amount: 550000,
        status: "PAID",
        settledAt: "2025-10-01 13:20",
    },
    {
        sid: "S-202510-002",
        companyName: "G2I4",
        businessNo: "210-11-33333",
        type: "PLATFORM_FEE",
        amount: 880000,
        status: "PENDING",
        settledAt: "2025-10-03 09:10",
    },
    {
        sid: "S-202510-003",
        companyName: "모두체",
        businessNo: "311-22-44444",
        type: "BANNER_AD",
        amount: 240000,
        status: "HOLD",
        settledAt: "2025-10-05 16:42",
    },
];

// 라벨 매핑
const TYPE_LABEL = {
    BANNER_AD: "배너광고",
    PLATFORM_FEE: "플랫폼 수수료",
};

const STATUS_LABEL = {
    PAID: "지급 완료",
    PENDING: "지급 예정",
    HOLD: "보류",
};

const STATUS_COLOR = {
    PAID: "success",
    PENDING: "warning",
    HOLD: "default",
};

function CalculatePage() {
    // 상태값
    const [list, setList] = useState(DUMMY_SETTLEMENTS);

    // 필터 상태
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL"); // PAID / PENDING / HOLD
    const [typeFilter, setTypeFilter] = useState("ALL"); // BANNER_AD / PLATFORM_FEE
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // 페이지네이션
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    // 액션 핸들러
    const handleRefresh = () => {
        console.log("🔄 정산 내역 새로고침 (API)");
    };

    const handleExport = () => {
        console.log("⬇ 정산 내역 다운로드 (엑셀/CSV)");
    };

    const handleView = (sid) => {
        console.log("👁 정산 상세 보기:", sid);
    };

    // 필터링 로직
    const filteredList = useMemo(() => {
        const kw = keyword.trim().toLowerCase();

        return list.filter((row) => {
            // 검색 대상: 업체명 / 사업자번호 / 정산번호
            const matchKeyword =
                kw === "" ||
                row.companyName.toLowerCase().includes(kw) ||
                row.businessNo.toLowerCase().includes(kw) ||
                row.sid.toLowerCase().includes(kw);

            // 상태 필터
            const matchStatus =
                statusFilter === "ALL" ? true : row.status === statusFilter;

            // 타입 필터
            const matchType =
                typeFilter === "ALL" ? true : row.type === typeFilter;

            // 날짜 필터 (정산일 settledAt의 앞부분 yyyy-mm-dd 비교)
            const dateOnly = row.settledAt.slice(0, 10); // "2025-10-01"
            const matchFrom = fromDate ? dateOnly >= fromDate : true;
            const matchTo = toDate ? dateOnly <= toDate : true;

            return (
                matchKeyword &&
                matchStatus &&
                matchType &&
                matchFrom &&
                matchTo
            );
        });
    }, [list, keyword, statusFilter, typeFilter, fromDate, toDate]);

    // 현재 페이지 데이터
    const pagedList = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredList.slice(start, start + rowsPerPage);
    }, [filteredList, page]);

    const pageCount = Math.ceil(filteredList.length / rowsPerPage) || 1;

    // 필터 변경 시 페이지 리셋
    useEffect(() => {
        setPage(1);
    }, [keyword, statusFilter, typeFilter, fromDate, toDate, list]);

    // 총 금액 합산 (현재 필터된 리스트 기준)
    const totalAmount = useMemo(() => {
        return filteredList.reduce((sum, row) => sum + row.amount, 0);
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
            {/* 1. 상단 영역: 타이틀 / 설명 (관리자 계정 페이지 스타일) */}
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
                    정산 내역
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        lineHeight: 1.5,
                        textAlign: { xs: "left", sm: "center" },
                    }}
                >
                    배너, 수수료 등 정산 완료 및 예정 내역을 조회하고
                    다운로드할 수 있습니다.
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* 옵션 바: 기간 / 상태 / 유형 / 검색 / 합계 / 유틸 */}
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
                {/* 왼쪽: 필터들 */}
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
                    {/* 기간 FROM */}
                    <TextField
                        label="시작일"
                        type="date"
                        size="small"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
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
                            "& input": {
                                fontSize: "0.8rem",
                            },
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    {/* 기간 TO */}
                    <TextField
                        label="종료일"
                        type="date"
                        size="small"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
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
                            "& input": {
                                fontSize: "0.8rem",
                            },
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    {/* 상태 필터 */}
                    <TextField
                        select
                        label="상태"
                        size="small"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        sx={{
                            minWidth: 110,
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
                        <MenuItem value="PAID">지급 완료</MenuItem>
                        <MenuItem value="PENDING">지급 예정</MenuItem>
                        <MenuItem value="HOLD">보류</MenuItem>
                    </TextField>

                    {/* 정산 유형 필터 */}
                    <TextField
                        select
                        label="정산 유형"
                        size="small"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
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
                        <MenuItem value="BANNER_AD">배너광고</MenuItem>
                        <MenuItem value="PLATFORM_FEE">플랫폼 수수료</MenuItem>
                    </TextField>

                    {/* 검색 */}
                    <TextField
                        size="small"
                        placeholder="업체명 / 사업자번호 / 정산번호 검색"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        sx={{
                            minWidth: { xs: "100%", md: 260 },
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 5,
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

                {/* 오른쪽: 합계 / 새로고침 / 다운로드 */}
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
                    {/* 합계 정보 */}
                    <Box sx={{ textAlign: "right", mr: 1 }}>
                        <Typography
                            sx={{
                                fontSize: "0.8rem",
                                color: "text.secondary",
                                fontWeight: 400,
                                whiteSpace: "nowrap",
                            }}
                        >
                            총 {filteredList.length}건
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                color: "text.primary",
                            }}
                        >
                            합계{" "}
                            {totalAmount.toLocaleString("ko-KR", {
                                maximumFractionDigits: 0,
                            })}
                            원
                        </Typography>
                    </Box>

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

            {/* 테이블 */}
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
                            <TableCell sx={{ minWidth: 120 }}>정산번호</TableCell>
                            <TableCell sx={{ minWidth: 140 }}>업체명</TableCell>
                            <TableCell sx={{ minWidth: 120 }}>
                                사업자번호
                            </TableCell>
                            <TableCell sx={{ minWidth: 110 }}>유형</TableCell>
                            <TableCell sx={{ minWidth: 100 }}>금액</TableCell>
                            <TableCell sx={{ minWidth: 100 }}>상태</TableCell>
                            <TableCell sx={{ minWidth: 130 }}>정산일</TableCell>
                            <TableCell align="right" sx={{ minWidth: 80 }}>
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
                                    조건에 맞는 정산 내역이 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pagedList.map((row) => (
                                <TableRow
                                    key={row.sid}
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
                                    {/* 정산번호 */}
                                    <TableCell
                                        sx={{
                                            fontFamily: "monospace",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {row.sid}
                                    </TableCell>

                                    {/* 업체명 */}
                                    <TableCell
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {row.companyName}
                                    </TableCell>

                                    {/* 사업자번호 */}
                                    <TableCell
                                        sx={{
                                            fontSize: "0.8rem",
                                            color: "text.secondary",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {row.businessNo}
                                    </TableCell>

                                    {/* 유형 */}
                                    <TableCell>
                                        <Chip
                                            label={
                                                TYPE_LABEL[row.type] || row.type
                                            }
                                            size="small"
                                            color={
                                                row.type === "BANNER_AD"
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

                                    {/* 금액 */}
                                    <TableCell
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: "0.85rem",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {row.amount.toLocaleString("ko-KR", {
                                            maximumFractionDigits: 0,
                                        })}
                                        원
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

                                    {/* 정산일 */}
                                    <TableCell
                                        sx={{
                                            fontSize: "0.8rem",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {row.settledAt}
                                    </TableCell>

                                    {/* 액션 */}
                                    <TableCell align="right">
                                        <Tooltip title="상세 보기">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleView(row.sid)
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

            {/* 페이지네이션 */}
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

export default CalculatePage;