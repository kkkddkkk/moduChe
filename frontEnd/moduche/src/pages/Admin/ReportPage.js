// src/pages/Admin/ReportPage.js
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

import axios from "axios";
import { API_SERVER_HOST, AUTH } from "../../component/common/Variables";
import Paper from "../../component/common/Paper";

// axios + JWT
const http = axios.create({
    baseURL: API_SERVER_HOST,
    withCredentials: false,
});

http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(AUTH.TOKEN_KEY);
        if (token) {
            config.headers[AUTH.HEADER_KEY] = AUTH.SCHEME + token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const REPORTS_ENDPOINT = "/api/reports";

const REPORT_STATUS_LABEL = {
    PENDING: "처리 대기",
    REVIEWING: "검토 중",
    RESOLVED: "처리 완료",
    REJECTED: "기각",
};

const REPORT_STATUS_COLOR = {
    PENDING: "warning",
    REVIEWING: "info",
    RESOLVED: "success",
    REJECTED: "default",
};

const TARGET_TYPE_LABEL = {
    USER: "사용자",
    MESSAGE: "채팅 메시지",
    POST: "게시글",
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

    const fetchReports = async () => {
        try {
            setLoading(true);
            const resp = await http.get(REPORTS_ENDPOINT, {
                params: {
                    // status: statusFilter === "ALL" ? undefined : statusFilter,
                    // targetType: targetTypeFilter === "ALL" ? undefined : targetTypeFilter,
                    // q: keyword || undefined,
                },
            });

            const data = resp.data;
            const reports = data?.content ?? data ?? [];
            setList(Array.isArray(reports) ? reports : []);
        } catch (e) {
            console.error(
                "신고 목록 로드 실패",
                e.response?.status,
                (e.response?.config?.baseURL || "") +
                    (e.response?.config?.url || ""),
                e.response?.data || e.message
            );
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRefresh = () => {
        fetchReports();
    };

    const handleView = (reportId) => {
        const found = list.find((r) => String(r.reportId) === String(reportId));
        if (!found) return;
        setSelected(found);
        setDetailOpen(true);
    };

    // 상태 변경 예시: POST /api/reports/{id}/status
    const updateStatus = async (newStatus) => {
        if (!selected) return;
        try {
            await http.post(`${REPORTS_ENDPOINT}/${selected.reportId}/status`, {
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
            console.error(
                "상태 변경 실패",
                e.response?.status,
                (e.response?.config?.baseURL || "") +
                    (e.response?.config?.url || ""),
                e.response?.data || e.message
            );
            setToast({
                open: true,
                message: "신고 상태 변경에 실패했습니다.",
                severity: "error",
            });
        }
    };

    const filteredList = useMemo(() => {
        const kw = keyword.trim().toLowerCase();

        return (list || []).filter((row) => {
            const reporterName = row.reporterName || "";
            const targetSummary = row.targetSummary || ""; // 예: 신고 대상 요약
            const reason = row.reason || "";

            const matchKeyword =
                kw === "" ||
                reporterName.toLowerCase().includes(kw) ||
                targetSummary.toLowerCase().includes(kw) ||
                reason.toLowerCase().includes(kw);

            const matchStatus =
                statusFilter === "ALL" ? true : row.status === statusFilter;

            const matchTargetType =
                targetTypeFilter === "ALL"
                    ? true
                    : row.targetType === targetTypeFilter;

            return matchKeyword && matchStatus && matchTargetType;
        });
    }, [list, keyword, statusFilter, targetTypeFilter]);

    const pagedList = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredList.slice(start, start + rowsPerPage);
    }, [filteredList, page]);

    const pageCount = Math.ceil(filteredList.length / rowsPerPage) || 1;

    useEffect(() => {
        setPage(1);
    }, [keyword, statusFilter, targetTypeFilter, list]);

    const pendingCount = useMemo(
        () => filteredList.filter((r) => r.status === "PENDING").length,
        [filteredList]
    );
    const resolvedCount = useMemo(
        () => filteredList.filter((r) => r.status === "RESOLVED").length,
        [filteredList]
    );

    const DetailRow = ({ label, value }) => (
        <Stack
            direction="row"
            spacing={2}
            sx={{ py: 0.75, borderBottom: "1px solid", borderColor: "divider" }}
        >
            <Typography
                sx={{
                    width: 90,
                    minWidth: 90,
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    fontWeight: 600,
                }}
            >
                {label}
            </Typography>
            <Typography
                sx={{
                    flexGrow: 1,
                    fontSize: "0.9rem",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                }}
            >
                {value || "-"}
            </Typography>
        </Stack>
    );

    return (
        <>
            <Paper
                sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    boxShadow: 1,
                }}
            >
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
                        신고 관리
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            lineHeight: 1.5,
                            textAlign: { xs: "left", sm: "center" },
                        }}
                    >
                        사용자 신고 내역을 확인하고 처리 상태를 관리할 수
                        있습니다.
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
                            label="상태"
                            size="small"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
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
                                "& .MuiInputLabel-root": {
                                    fontSize: "0.75rem",
                                },
                            }}
                        >
                            <MenuItem value="ALL">전체</MenuItem>
                            <MenuItem value="PENDING">처리 대기</MenuItem>
                            <MenuItem value="REVIEWING">검토 중</MenuItem>
                            <MenuItem value="RESOLVED">처리 완료</MenuItem>
                            <MenuItem value="REJECTED">기각</MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="대상 타입"
                            size="small"
                            value={targetTypeFilter}
                            onChange={(e) =>
                                setTargetTypeFilter(e.target.value)
                            }
                            sx={{
                                minWidth: 150,
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
                            <MenuItem value="USER">사용자</MenuItem>
                            <MenuItem value="MESSAGE">채팅 메시지</MenuItem>
                            <MenuItem value="POST">게시글</MenuItem>
                        </TextField>

                        <TextField
                            size="small"
                            placeholder="신고자 / 대상 / 사유 검색"
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
                                대기 {pendingCount}건 · 처리 완료{" "}
                                {resolvedCount}건
                            </Typography>
                        </Box>

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
                                <TableCell sx={{ minWidth: 80 }}>
                                    신고ID
                                </TableCell>
                                <TableCell sx={{ minWidth: 130 }}>
                                    신고자
                                </TableCell>
                                <TableCell sx={{ minWidth: 120 }}>
                                    대상 타입
                                </TableCell>
                                <TableCell sx={{ minWidth: 180 }}>
                                    대상 요약
                                </TableCell>
                                <TableCell sx={{ minWidth: 130 }}>
                                    상태
                                </TableCell>
                                <TableCell sx={{ minWidth: 150 }}>
                                    신고일
                                </TableCell>
                                <TableCell align="right" sx={{ minWidth: 100 }}>
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
                                        sx={{
                                            py: 6,
                                            color: "text.secondary",
                                        }}
                                    >
                                        {loading
                                            ? "불러오는 중..."
                                            : "조건에 맞는 신고가 없습니다."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pagedList.map((row) => (
                                    <TableRow
                                        key={row.reportId}
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
                                        <TableCell
                                            sx={{
                                                fontFamily: "monospace",
                                                fontSize: "0.8rem",
                                            }}
                                        >
                                            {row.reportId}
                                        </TableCell>

                                        <TableCell sx={{ fontSize: "0.85rem" }}>
                                            {row.reporterName} (
                                            <span
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "gray",
                                                }}
                                            >
                                                {row.reporterEmail}
                                            </span>
                                            )
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={
                                                    TARGET_TYPE_LABEL[
                                                        row.targetType
                                                    ] || row.targetType
                                                }
                                                size="small"
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: "0.7rem",
                                                    px: 1,
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                maxWidth: 220,
                                                fontSize: "0.8rem",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {row.targetSummary}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={
                                                    REPORT_STATUS_LABEL[
                                                        row.status
                                                    ] || row.status
                                                }
                                                size="small"
                                                color={
                                                    REPORT_STATUS_COLOR[
                                                        row.status
                                                    ] || "default"
                                                }
                                                icon={
                                                    row.status ===
                                                    "RESOLVED" ? (
                                                        <CheckCircleIcon
                                                            sx={{
                                                                fontSize: 16,
                                                            }}
                                                        />
                                                    ) : row.status ===
                                                      "REJECTED" ? (
                                                        <CancelIcon
                                                            sx={{
                                                                fontSize: 16,
                                                            }}
                                                        />
                                                    ) : undefined
                                                }
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: "0.7rem",
                                                    px: 1,
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontSize: "0.8rem",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {row.reportedAt
                                                ? new Date(
                                                      row.reportedAt
                                                  ).toLocaleString()
                                                : "-"}
                                        </TableCell>

                                        <TableCell align="right">
                                            <Tooltip title="상세 보기">
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        handleView(row.reportId)
                                                    }
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="처리 완료">
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        sx={{ ml: 0.5 }}
                                                        onClick={() => {
                                                            setSelected(row);
                                                            updateStatus(
                                                                "RESOLVED"
                                                            );
                                                        }}
                                                        disabled={
                                                            row.status ===
                                                                "RESOLVED" ||
                                                            row.status ===
                                                                "REJECTED"
                                                        }
                                                    >
                                                        <GavelIcon fontSize="small" />
                                                    </IconButton>
                                                </span>
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
            </Paper>

            {/* 상세 다이얼로그 */}
            <Dialog
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700, pb: 1.5 }}>
                    신고 상세
                </DialogTitle>
                <DialogContent dividers sx={{ px: 3 }}>
                    {selected ? (
                        <Box sx={{ pt: 1 }}>
                            <DetailRow
                                label="신고ID"
                                value={selected.reportId}
                            />
                            <DetailRow
                                label="신고자"
                                value={`${selected.reporterName} (${selected.reporterEmail})`}
                            />
                            <DetailRow
                                label="대상 타입"
                                value={
                                    TARGET_TYPE_LABEL[selected.targetType] ||
                                    selected.targetType
                                }
                            />
                            <DetailRow
                                label="대상 ID"
                                value={selected.targetId}
                            />
                            <DetailRow
                                label="대상 요약"
                                value={selected.targetSummary}
                            />
                            <DetailRow label="사유" value={selected.reason} />
                            <DetailRow
                                label="상태"
                                value={
                                    REPORT_STATUS_LABEL[selected.status] ||
                                    selected.status
                                }
                            />
                            <DetailRow
                                label="신고일"
                                value={
                                    selected.reportedAt
                                        ? new Date(
                                              selected.reportedAt
                                          ).toLocaleString()
                                        : "-"
                                }
                            />
                            <DetailRow
                                label="처리일"
                                value={
                                    selected.resolvedAt
                                        ? new Date(
                                              selected.resolvedAt
                                          ).toLocaleString()
                                        : "-"
                                }
                            />
                            <DetailRow
                                label="처리 메모"
                                value={selected.adminMemo}
                            />
                        </Box>
                    ) : (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ py: 2 }}
                        >
                            선택된 신고가 없습니다.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions
                    sx={{ px: 3, py: 1.5, justifyContent: "space-between" }}
                >
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<GavelIcon fontSize="small" />}
                            onClick={() => updateStatus("RESOLVED")}
                            disabled={
                                !selected ||
                                selected.status === "RESOLVED" ||
                                selected.status === "REJECTED"
                            }
                        >
                            처리 완료
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<CancelIcon fontSize="small" />}
                            onClick={() => updateStatus("REJECTED")}
                            disabled={
                                !selected ||
                                selected.status === "RESOLVED" ||
                                selected.status === "REJECTED"
                            }
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

            {/* 토스트 */}
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
