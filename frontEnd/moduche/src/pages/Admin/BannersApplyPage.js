import React, { useState, useMemo, useEffect, useRef } from "react";
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Paper as MuiPaper,
    Snackbar,
    Alert,
    Badge,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import Paper from "../../component/common/Paper";
import BannerApplyManageRow from "../../component/banner/BannerApplyManageRow";
import BannerPreviewModal from "../../component/banner/BannerPreviewModal";
import {
    acceptBannerApply,
    fetchBannerAppyList,
} from "../../api/bannerAPI/bannerAPI";

export default function BannersApplyPage() {
    const [page, setPage] = useState(1);
    const [search, serSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);

    const [applies, setApplies] = useState(null);

    const [selectedApply, setSelectedApply] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);

    const [loading, setLoading] = useState(false);
    useEffect(() => {
        loadData();
    }, [page, search]);

    const loadData = async () => {
        setLoading(true);
        try {
            // 실제 API 호출
            const data = await fetchBannerAppyList(page - 1, 5, search);
            setLoading(false);

            setApplies(data.content);
            setTotalPages(data.totalPages);
        } catch (e) {
            setLoading(false);
            console.error("배너 신청 내역 조회 실패:", e);
        }
    };

    const handleDetail = (data) => {
        setSelectedApply(data);
        setOpenDetail(true);
    };

    const handleApprove = async (bannerId) => {
        setLoading(true);
        try {
            // 실제 API 호출
            await acceptBannerApply(bannerId);
            setLoading(false);
            setOpenDetail(false);
            loadData();
        } catch (e) {
            setLoading(false);
            console.error("배너 신청 내역 조회 실패:", e);
        }
    };

    const handleDecline = (reason) => {};

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
            {/* 타이틀 */}
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
                    등록된 배너 신청 내역
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        lineHeight: 1.5,
                        textAlign: { xs: "left", sm: "center" },
                    }}
                >
                    배너 출력 승인 및 거절을 할 수 있습니다.
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* 옵션 바 (CalculatePage 스타일 통일) */}
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
                    <TextField
                        select
                        label="노출 위치"
                        size="small"
                        sx={{
                            minWidth: 130,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                backgroundColor: "background.paper",
                                "& fieldset": { borderColor: "divider" },
                                "&:hover fieldset": {
                                    borderColor: "primary.light",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "primary.main",
                                },
                            },
                            "& .MuiInputLabel-root": { fontSize: "0.75rem" },
                        }}
                    >
                        <MenuItem value="ALL">전체</MenuItem>
                        <MenuItem value="MAIN">메인</MenuItem>
                        <MenuItem value="HEADER">헤더</MenuItem>
                        <MenuItem value="SIDE">사이드</MenuItem>
                    </TextField>

                    <TextField
                        size="small"
                        placeholder="배너 신청자 이름 검색"
                        sx={{
                            minWidth: { xs: "100%", md: 260 },
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 5,
                                backgroundColor: "background.paper",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                "& fieldset": { borderColor: "transparent" },
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

                <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="wrap"
                    spacing={1.5}
                    sx={{
                        width: { xs: "100%", md: "auto" },
                        justifyContent: { xs: "space-between", md: "flex-end" },
                    }}
                >
                    <Tooltip title="새로고침">
                        <IconButton
                            size="small"
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
                    overflowX: "hidden",
                    "&::-webkit-scrollbar": { width: 6, height: 6 },
                    "&::-webkit-scrollbar-thumb": {
                        bgcolor: "rgba(0,0,0,0.2)",
                        borderRadius: 3,
                    },
                }}
            >
                <Table
                    stickyHeader
                    size="small"
                    sx={{
                        tableLayout: "fixed",
                        minWidth: 920,
                    }}
                >
                    <TableHead>
                        <TableRow
                            sx={{
                                "& th": {
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                    fontSize: "0.8rem",
                                    color: "text.primary",
                                },
                            }}
                        >
                            <TableCell sx={{ width: 100 }}>신청 ID</TableCell>
                            <TableCell sx={{ width: 100 }}>배너 유형</TableCell>
                            <TableCell sx={{ width: 100 }}>노출 기간</TableCell>
                            <TableCell sx={{ width: 100 }}>
                                노출 중요도
                            </TableCell>
                            <TableCell sx={{ width: 100 }}>신청인</TableCell>
                            <TableCell sx={{ width: 100 }}>신청일</TableCell>
                            <TableCell sx={{ width: 100 }} align="right">
                                액션
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody sx={{}}>
                        {applies?.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    align="center"
                                    sx={{ py: 6, color: "text.secondary" }}
                                >
                                    등록된 배너 신청 내역이 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            applies?.map((data) => (
                                <BannerApplyManageRow
                                    apply={data}
                                    onDetail={(data) => handleDetail(data)}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </Box>

            <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                <Pagination
                    count={totalPages}
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

            <BannerPreviewModal
                data={selectedApply}
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                OnApprove={(id) => handleApprove(id)}
                OnDecline={(reason) => handleDecline(reason)}
            />
        </Paper>
    );
}
