import React, { useState, useEffect, useMemo } from "react";
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
    Snackbar,
    Alert,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import GavelIcon from "@mui/icons-material/Gavel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import Paper from "../../component/common/Paper";

const REPORTS_ENDPOINT = "/reports"; // baseURL/api/reports

const REPORT_STATUS_LABEL = {
    PENDING: "처리 대기",
    RESOLVED: "처리 완료",
    REJECTED: "기각",
};

const REPORT_STATUS_COLOR = {
    PENDING: "warning",
    RESOLVED: "success",
    REJECTED: "default",
};

const TARGET_TYPE_LABEL = {
    POST: "게시글",
    COMMENT: "댓글",
};

function ReportPage() {
    const [list, setList] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [targetTypeFilter, setTargetTypeFilter] = useState("ALL");

    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const [loading, setLoading] = useState(false);

    const [detailOpen, setDetailOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const navigate = useNavigate();

    // 신고 대상으로 이동 (리스트 & 모달에서 공통 사용)
    const gotoTarget = (row) => {
        if (!row) return;

        switch (row.targetType) {
            case "POST":
                navigate(`/community/post/${row.targetId}`);
                break;

            case "COMMENT":
                navigate(`/community/post/${row.targetId}?focus=comment`);
                break;

            case "USER":
                navigate(`/admin/users/${row.targetId}`);
                break;

            default:
                alert("이동할 수 없는 신고 대상입니다.");
        }
    };

    /** 신고 목록 로드 */
    const fetchReports = async () => {
        try {
            setLoading(true);
            const resp = await api.get(REPORTS_ENDPOINT);

            const data = resp.data;
            const reports = data?.content ?? data ?? [];
            setList(Array.isArray(reports) ? reports : []);
        } catch (e) {
            console.error("신고 목록 로드 실패:", e);
            setToast({
                open: true,
                message: "신고 목록을 불러오지 못했습니다.",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleRefresh = () => fetchReports();

    const handleView = (reportId) => {
        const found = list.find((r) => String(r.reportId) === String(reportId));
        if (!found) return;
        setSelected(found);
        setDetailOpen(true);
    };

    /** 상태 변경 */
    const updateStatus = async (newStatus) => {
        if (!selected) return;

        try {
            await api.post(`${REPORTS_ENDPOINT}/${selected.reportId}/status`, {
                status: newStatus,
            });

            setToast({
                open: true,
                message: "신고 상태가 변경되었습니다.",
                severity: "success",
            });
            setDetailOpen(false);
            fetchReports();
        } catch (e) {
            console.error("상태 변경 실패:", e);
            setToast({
                open: true,
                message: "상태 변경 실패",
                severity: "error",
            });
        }
    };

    /** 리스트 필터링 */
    const filteredList = useMemo(() => {
        const kw = keyword.trim().toLowerCase();

        return (list || []).filter((row) => {
            const reporterName = row.reporterName || "";
            const targetSummary = row.targetSummary || "";
            const reason = row.reason || "";

            const matchKeyword =
                kw === "" ||
                reporterName.toLowerCase().includes(kw) ||
                targetSummary.toLowerCase().includes(kw) ||
                reason.toLowerCase().includes(kw);

            const matchStatus =
                statusFilter === "ALL" ? true : row.status === statusFilter;

            const matchType =
                targetTypeFilter === "ALL"
                    ? true
                    : row.targetType === targetTypeFilter;

            return matchKeyword && matchStatus && matchType;
        });
    }, [list, keyword, statusFilter, targetTypeFilter]);

    /** 페이지 처리 */
    const pagedList = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredList.slice(start, start + rowsPerPage);
    }, [filteredList, page]);

    const pageCount = Math.ceil(filteredList.length / rowsPerPage) || 1;

    useEffect(
        () => setPage(1),
        [keyword, statusFilter, targetTypeFilter, list]
    );

    const pendingCount = filteredList.filter((r) => r.status === "PENDING").length;
    const resolvedCount = filteredList.filter((r) => r.status === "RESOLVED").length;

    const DetailRow = ({ label, value }) => (
        <Stack
            direction="row"
            spacing={2}
            sx={{ py: 0.75, borderBottom: "1px solid", borderColor: "divider" }}
        >
            <Typography sx={{ width: 90, fontSize: "0.85rem", fontWeight: 600 }}>
                {label}
            </Typography>
            <Typography sx={{ flexGrow: 1, fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>
                {value || "-"}
            </Typography>
        </Stack>
    );

    return (
        <>
            {/* 상단 컨테이너 */}
            <Paper
                sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    boxShadow: 1,
                }}
            >
                {/* 제목 */}
                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{
                            color: "primary.main",
                            mb: 1,
                            textAlign: { xs: "left", sm: "center" },
                        }}
                    >
                        신고 관리
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: { xs: "left", sm: "center" } }}
                    >
                        사용자 신고 내역을 확인하고 처리 상태를 관리할 수 있습니다.
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
                        bgcolor: (t) =>
                            t.palette.mode === "dark"
                                ? t.palette.background.default
                                : t.palette.grey[50],
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
                                    "& fieldset": { borderColor: "divider" },
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
                            <MenuItem value="PENDING">처리 대기</MenuItem>
                            <MenuItem value="RESOLVED">처리 완료</MenuItem>
                            <MenuItem value="REJECTED">기각</MenuItem>
                        </TextField>

                        {/* 대상 타입 필터 */}
                        <TextField
                            select
                            label="대상 타입"
                            size="small"
                            value={targetTypeFilter}
                            onChange={(e) => setTargetTypeFilter(e.target.value)}
                            sx={{
                                minWidth: 110,
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
                                "& .MuiInputLabel-root": {
                                    fontSize: "0.75rem",
                                },
                            }}
                        >
                            <MenuItem value="ALL">전체</MenuItem>
                            <MenuItem value="POST">게시글</MenuItem>
                            <MenuItem value="COMMENT">댓글</MenuItem>
                        </TextField>

                        {/* 검색창 */}
                        <TextField
                            size="small"
                            placeholder="신고자 / 대상 / 사유 검색"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                minWidth: { xs: "100%", md: 280 },
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
                        />
                    </Box>

                    {/* 우측 정보 */}
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ textAlign: "right" }}>
                            <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                                총 {filteredList.length}건
                            </Typography>
                            <Typography sx={{ fontSize: "0.8rem", fontWeight: 600 }}>
                                대기 {pendingCount}건 · 완료 {resolvedCount}건
                            </Typography>
                        </Box>

                        <Tooltip title="새로고침">
                            <IconButton size="small" onClick={handleRefresh}>
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
                        maxHeight: 480,
                        overflow: "auto",
                    }}
                >
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>신고ID</TableCell>
                                <TableCell>신고자</TableCell>
                                <TableCell>대상 타입</TableCell>
                                <TableCell>대상 요약</TableCell>
                                <TableCell>상태</TableCell>
                                <TableCell>신고일</TableCell>
                                <TableCell align="right">액션</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {pagedList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                        {loading ? "불러오는 중..." : "조건에 맞는 신고가 없습니다."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pagedList.map((row) => (
                                    <TableRow key={row.reportId} hover>
                                        <TableCell>{row.reportId}</TableCell>

                                        <TableCell>
                                            {row.reporterName} ({row.reporterEmail})
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={TARGET_TYPE_LABEL[row.targetType] || row.targetType}
                                                size="small"
                                            />
                                        </TableCell>

                                        {/* ★ 클리커블: 대상 이동 */}
                                        <TableCell
                                            sx={{
                                                cursor: "pointer",
                                                maxWidth: 220,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                color: "primary.main",
                                                textDecoration: "underline",
                                            }}
                                            onClick={() => gotoTarget(row)}
                                        >
                                            {row.targetSummary}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={REPORT_STATUS_LABEL[row.status] || row.status}
                                                size="small"
                                                color={REPORT_STATUS_COLOR[row.status] || "default"}
                                                icon={
                                                    row.status === "RESOLVED" ? (
                                                        <CheckCircleIcon sx={{ fontSize: 16 }} />
                                                    ) : row.status === "REJECTED" ? (
                                                        <CancelIcon sx={{ fontSize: 16 }} />
                                                    ) : undefined
                                                }
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {row.reportedAt
                                                ? new Date(row.reportedAt).toLocaleString()
                                                : "-"}
                                        </TableCell>

                                        <TableCell align="right">
                                            <Tooltip title="상세 보기">
                                                <IconButton size="small" onClick={() => handleView(row.reportId)}>
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

                {/* ===========================
                    페이지네이션
                ============================ */}
                <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                        size="small"
                        showFirstButton
                        showLastButton
                    />
                </Stack>
            </Paper>

            {/* ===========================
                상세 모달
            ============================ */}
            <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>신고 상세</DialogTitle>

                <DialogContent dividers sx={{ px: 3 }}>
                    {selected ? (
                        <Box sx={{ pt: 1 }}>
                            <DetailRow label="신고ID" value={selected.reportId} />
                            <DetailRow
                                label="신고자"
                                value={`${selected.reporterName} (${selected.reporterEmail})`}
                            />
                            <DetailRow
                                label="대상 타입"
                                value={TARGET_TYPE_LABEL[selected.targetType] || selected.targetType}
                            />
                            <DetailRow label="대상 ID" value={selected.targetId} />
                            <DetailRow label="대상 요약" value={selected.targetSummary} />
                            <DetailRow label="사유" value={selected.reason} />
                            <DetailRow
                                label="상태"
                                value={REPORT_STATUS_LABEL[selected.status] || selected.status}
                            />
                            <DetailRow
                                label="신고일"
                                value={
                                    selected.reportedAt
                                        ? new Date(selected.reportedAt).toLocaleString()
                                        : "-"
                                }
                            />
                            <DetailRow
                                label="처리일"
                                value={
                                    selected.resolvedAt
                                        ? new Date(selected.resolvedAt).toLocaleString()
                                        : "-"
                                }
                            />
                            <DetailRow label="메모" value={selected.adminMemo} />
                        </Box>
                    ) : (
                        <Typography sx={{ py: 2 }}>선택된 신고 없음</Typography>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 1.5, justifyContent: "space-between" }}>
                    <Stack direction="row" spacing={1}>
                        {/* ★ 상세 페이지 바로가기 버튼 */}
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            disabled={!selected || !selected.targetId}
                            onClick={() => gotoTarget(selected)}
                        >
                            대상 페이지 이동
                        </Button>

                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<GavelIcon fontSize="small" />}
                            disabled={
                                !selected ||
                                selected.status === "RESOLVED" ||
                                selected.status === "REJECTED"
                            }
                            onClick={() => updateStatus("RESOLVED")}
                        >
                            처리 완료
                        </Button>

                        <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<CancelIcon fontSize="small" />}
                            disabled={
                                !selected ||
                                selected.status === "RESOLVED" ||
                                selected.status === "REJECTED"
                            }
                            onClick={() => updateStatus("REJECTED")}
                        >
                            기각
                        </Button>
                    </Stack>

                    <Button
                        onClick={() => setDetailOpen(false)}
                        variant="contained"
                        size="small"
                    >
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ===========================
                토스트 알림
            ============================ */}
            <Snackbar
                open={toast.open}
                autoHideDuration={2200}
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
        </>
    );
}

export default ReportPage;
