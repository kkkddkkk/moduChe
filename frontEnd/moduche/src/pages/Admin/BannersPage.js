// src/pages/Admin/BannersPage.js
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Paper as MuiPaper,
    Snackbar,
    Alert,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from "@mui/icons-material/PlaylistAdd";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteIcon from "@mui/icons-material/DeleteForever";

import Paper from "../../component/common/Paper";

// ---------------------- 더미 데이터 (ERD 기준) ----------------------
const DUMMY_BANNERS = [
    {
        banner_id: "BN-202510-001",
        admin_id: 1,
        title: "가을 프로모션 메인 배너",
        image_url: "https://cdn.example.com/banners/fall_main.jpg",
        target_url: "https://moduche.com/promo/fall",
        location: "MAIN",
        start_date: "2025-10-01",
        end_date: "2025-10-31",
        order_index: 1,
    },
    {
        banner_id: "BN-202510-002",
        admin_id: 3,
        title: "신규 강좌 헤더 배너",
        image_url: "https://cdn.example.com/banners/newcourse_header.jpg",
        target_url: "https://moduche.com/courses/new",
        location: "HEADER",
        start_date: "2025-10-15",
        end_date: "2025-11-15",
        order_index: 2,
    },
    {
        banner_id: "BN-202509-014",
        admin_id: 2,
        title: "커뮤니티 이벤트 사이드",
        image_url: "https://cdn.example.com/banners/community_side.png",
        target_url: "https://moduche.com/community/event",
        location: "SIDE",
        start_date: "2025-09-01",
        end_date: "2025-09-30",
        order_index: 3,
    },
];

const LOCATION_LABEL = {
    MAIN: "메인",
    HEADER: "헤더",
    SIDE: "사이드",
    ETC: "기타",
};

// URL 복사
async function copyText(t = "") {
    try {
        await navigator.clipboard.writeText(t);
    } catch {}
}

export default function BannersPage() {
    const [banners, setBanners] = useState(DUMMY_BANNERS);

    // 필터 상태
    const [keyword, setKeyword] = useState(""); // 배너ID/제목
    const [locationFilter, setLocationFilter] = useState("ALL");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // 페이지네이션
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    // 상세 다이얼로그
    const [detailOpen, setDetailOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    // 삭제 확인 다이얼로그 + 토스트
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleRefresh = () => console.log("🔄 배너 목록 새로고침 (API)");
    const handleExport = () => console.log("⬇ 배너 목록 다운로드 (엑셀/CSV)");
    const handleCreateBanner = () =>
        console.log("🆕 새 배너 등록 화면/모달 오픈");

    const handleView = (banner_id) => {
        const found = banners.find((b) => b.banner_id === banner_id);
        if (found) {
            setSelected(found);
            setDetailOpen(true);
        }
    };

    const openDeleteConfirm = (banner_id) => {
        const found = banners.find((b) => b.banner_id === banner_id);
        if (found) setDeleteTarget(found);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setBanners((prev) =>
            prev.filter((b) => b.banner_id !== deleteTarget.banner_id)
        );
        setDeleteTarget(null);
        setToast({
            open: true,
            message: "배너가 삭제되었습니다.",
            severity: "success",
        });
    };

    // 필터링
    const filteredList = useMemo(() => {
        const kw = keyword.trim().toLowerCase();
        return banners.filter((b) => {
            const matchKeyword =
                kw === "" ||
                b.banner_id.toLowerCase().includes(kw) ||
                b.title.toLowerCase().includes(kw);
            const matchLocation =
                locationFilter === "ALL" ? true : b.location === locationFilter;
            const matchFrom = fromDate ? b.end_date >= fromDate : true;
            const matchTo = toDate ? b.start_date <= toDate : true;
            return matchKeyword && matchLocation && matchFrom && matchTo;
        });
    }, [banners, keyword, locationFilter, fromDate, toDate]);

    const pagedList = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredList.slice(start, start + rowsPerPage);
    }, [filteredList, page]);

    const pageCount = Math.ceil(filteredList.length / rowsPerPage) || 1;

    useEffect(
        () => setPage(1),
        [keyword, locationFilter, fromDate, toDate, banners]
    );

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
                    배너 관리
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        lineHeight: 1.5,
                        textAlign: { xs: "left", sm: "center" },
                    }}
                >
                    배너의 위치, 기간, 출력 순서를 확인하고 관리할 수 있습니다.
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* 옵션 바 */}
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
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        sx={{ minWidth: 130 }}
                    >
                        <MenuItem value="ALL">전체</MenuItem>
                        <MenuItem value="MAIN">메인</MenuItem>
                        <MenuItem value="HEADER">헤더</MenuItem>
                        <MenuItem value="SIDE">사이드</MenuItem>
                        <MenuItem value="ETC">기타</MenuItem>
                    </TextField>

                    <TextField
                        label="시작일"
                        type="date"
                        size="small"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        sx={{ minWidth: 140 }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="종료일"
                        type="date"
                        size="small"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        sx={{ minWidth: 140 }}
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        size="small"
                        placeholder="배너ID / 제목 검색"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        sx={{ minWidth: { xs: "100%", md: 260 } }}
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

                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateBanner}
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            px: 1.5,
                            py: 1,
                        }}
                    >
                        새 배너 등록
                    </Button>

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
                <Table
                    stickyHeader
                    size="small"
                    sx={{ tableLayout: "fixed", minWidth: 920 }}
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
                            <TableCell sx={{ width: 160 }}>배너ID</TableCell>
                            <TableCell sx={{ width: 100 }}>관리자ID</TableCell>
                            <TableCell sx={{ width: 300 }}>제목</TableCell>
                            <TableCell sx={{ width: 120 }}>위치</TableCell>
                            <TableCell sx={{ width: 220 }}>기간</TableCell>
                            <TableCell sx={{ width: 100 }}>출력순서</TableCell>
                            <TableCell sx={{ width: 120 }} align="right">
                                액션
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {pagedList.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    align="center"
                                    sx={{ py: 6, color: "text.secondary" }}
                                >
                                    조건에 맞는 배너가 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pagedList.map((row) => (
                                <TableRow
                                    key={row.banner_id}
                                    hover
                                    sx={{
                                        "&:last-of-type td": {
                                            borderBottom: 0,
                                        },
                                        transition:
                                            "background-color 0.15s ease-in-out",
                                        "&:hover": {
                                            backgroundColor: "rgba(0,0,0,0.03)",
                                        },
                                    }}
                                >
                                    <TableCell
                                        sx={{
                                            fontFamily: "monospace",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {row.banner_id}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontFamily: "monospace",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {row.admin_id}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: "0.9rem",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        <Tooltip title={row.title}>
                                            {row.title}
                                        </Tooltip>
                                    </TableCell>

                                    <TableCell sx={{ overflow: "visible" }}>
                                        <Chip
                                            label={
                                                LOCATION_LABEL[row.location] ||
                                                row.location
                                            }
                                            size="small"
                                            color={
                                                row.location === "MAIN"
                                                    ? "primary"
                                                    : "default"
                                            }
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: "0.75rem",
                                                px: 1,
                                                maxWidth: "none",
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontSize: "0.8rem",
                                            whiteSpace: "nowrap",
                                            color: "text.secondary",
                                        }}
                                    >
                                        {row.start_date} ~ {row.end_date}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {row.order_index}
                                    </TableCell>

                                    <TableCell align="right">
                                        <Tooltip title="상세">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleView(row.banner_id)
                                                }
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="삭제">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() =>
                                                    openDeleteConfirm(
                                                        row.banner_id
                                                    )
                                                }
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Box>

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

            {/* 상세 다이얼로그 */}
            <Dialog
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700 }}>배너 상세</DialogTitle>
                <DialogContent dividers>
                    {selected && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <MuiPaper
                                    variant="outlined"
                                    sx={{
                                        p: 1,
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        minHeight: 220,
                                    }}
                                >
                                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                                    <img
                                        src={selected.image_url}
                                        alt={selected.title}
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: 280,
                                            objectFit: "contain",
                                            borderRadius: 8,
                                        }}
                                    />
                                </MuiPaper>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Stack spacing={1.2}>
                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                    >
                                        배너ID
                                    </Typography>
                                    <Typography
                                        sx={{ fontFamily: "monospace" }}
                                    >
                                        {selected.banner_id}
                                    </Typography>

                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                        sx={{ mt: 1 }}
                                    >
                                        제목
                                    </Typography>
                                    <Typography>{selected.title}</Typography>

                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                        sx={{ mt: 1 }}
                                    >
                                        위치 / 기간 / 출력순서
                                    </Typography>
                                    <Typography>
                                        {LOCATION_LABEL[selected.location] ||
                                            selected.location}{" "}
                                        · {selected.start_date} ~{" "}
                                        {selected.end_date} · #
                                        {selected.order_index}
                                    </Typography>

                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                        sx={{ mt: 1 }}
                                    >
                                        이동 URL
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                    >
                                        <Box
                                            component="a"
                                            href={selected.target_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            sx={{
                                                color: "primary.main",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                display: "inline-block",
                                                maxWidth: 420,
                                            }}
                                            title={selected.target_url}
                                        >
                                            {selected.target_url}
                                        </Box>
                                        <Tooltip title="새 탭에서 열기">
                                            <IconButton
                                                size="small"
                                                component="a"
                                                href={selected.target_url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <OpenInNewIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="URL 복사">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    copyText(
                                                        selected.target_url
                                                    )
                                                }
                                            >
                                                <ContentCopyIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>

                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                        sx={{ mt: 1 }}
                                    >
                                        이미지 URL
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                    >
                                        <Box
                                            component="a"
                                            href={selected.image_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            sx={{
                                                color: "primary.main",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                display: "inline-block",
                                                maxWidth: 420,
                                            }}
                                            title={selected.image_url}
                                        >
                                            {selected.image_url}
                                        </Box>
                                        <Tooltip title="새 탭에서 열기">
                                            <IconButton
                                                size="small"
                                                component="a"
                                                href={selected.image_url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <OpenInNewIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="URL 복사">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    copyText(selected.image_url)
                                                }
                                            >
                                                <ContentCopyIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailOpen(false)}>닫기</Button>
                </DialogActions>
            </Dialog>

            {/* 삭제 확인 다이얼로그 */}
            <Dialog
                open={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700, color: "error.main" }}>
                    배너 삭제
                </DialogTitle>
                <DialogContent dividers>
                    {deleteTarget && (
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1.5 }}>
                                아래 배너를 정말로 삭제할까요? 이 작업은 되돌릴
                                수 없습니다.
                            </Typography>
                            <Stack spacing={0.5}>
                                <Typography sx={{ fontFamily: "monospace" }}>
                                    {deleteTarget.banner_id}
                                </Typography>
                                <Typography color="text.secondary">
                                    {deleteTarget.title}
                                </Typography>
                            </Stack>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteTarget(null)}>취소</Button>
                    <Button
                        onClick={confirmDelete}
                        color="error"
                        variant="contained"
                    >
                        삭제
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 토스트 */}
            <Snackbar
                open={toast.open}
                autoHideDuration={2000}
                onClose={() => setToast((t) => ({ ...t, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setToast((t) => ({ ...t, open: false }))}
                    severity={toast.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
}
