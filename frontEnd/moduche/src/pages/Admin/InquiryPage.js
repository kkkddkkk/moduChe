// src/pages/Admin/InquiryPage.js
// ----- 완전 통일 관리자 UI 스타일 적용 버전 -----

import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Stack,
    Typography,
    IconButton,
    Tooltip,
    TextField,
    MenuItem,
    Chip,
    Table,
    TableRow,
    TableCell,
    TableBody,
    TableHead,
    Pagination,
    InputAdornment,
    Divider,
    Button,
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
import ReplyIcon from "@mui/icons-material/Reply";

import Paper from "../../component/common/Paper";
import {
    fetchAdminInquiries,
    fetchAdminInquiryDetail,
    createAnswer,
    updateAnswer,
} from "../../api/inquiryApi/inquiryAdminApi";

// --------------------------------------
// 상수 설정
// --------------------------------------
const STATUS_LABEL = {
    WAIT: "답변 대기",
    WAITING: "답변 대기",
    ANSWERED: "답변 완료",
};
const STATUS_COLOR = {
    WAIT: "warning",
    WAITING: "warning",
    ANSWERED: "success",
};

const CATEGORY_LABEL = {
    SERVICE: "서비스 문의",
    BUG: "오류 신고",
    SUGGEST: "기능 제안",
};

export default function InquiryPage() {
    const [list, setList] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const [loading, setLoading] = useState(false);

    const [detailOpen, setDetailOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const [answerText, setAnswerText] = useState("");

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    // --------------------------------------
    // 데이터 로드
    // --------------------------------------
    const loadInquiries = async () => {
        try {
            setLoading(true);

            const res = await fetchAdminInquiries({
                page: 0,
                size: 9999,
            });

            setList(res?.content ?? []);
        } catch (err) {
            console.error(err);
            setToast({
                open: true,
                message: "문의 목록을 불러오지 못했습니다.",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInquiries();
    }, []);

    // --------------------------------------
    // 상세 보기
    // --------------------------------------
    const handleView = async (id) => {
        try {
            const data = await fetchAdminInquiryDetail(id);
            setSelected(data);
            setAnswerText(data.answer?.content || "");
            setDetailOpen(true);
        } catch {
            setToast({
                open: true,
                message: "상세 조회 중 오류",
                severity: "error",
            });
        }
    };

    // --------------------------------------
    // 답변 저장
    // --------------------------------------
    const handleSaveAnswer = async () => {
        if (!selected) return;

        try {
            if (selected.answer) {
                await updateAnswer(selected.answer.answerId, {
                    content: answerText,
                });
            } else {
                await createAnswer(selected.inquiryId, {
                    content: answerText,
                });
            }

            setToast({
                open: true,
                message: "답변이 저장되었습니다.",
                severity: "success",
            });

            setDetailOpen(false);
            loadInquiries();
        } catch {
            setToast({
                open: true,
                message: "답변 저장 실패",
                severity: "error",
            });
        }
    };

    // --------------------------------------
    // 리스트 필터링
    // --------------------------------------
    const filteredList = useMemo(() => {
        let result = [...list];
        const kw = keyword.trim().toLowerCase();

        if (kw.length > 0) {
            result = result.filter((v) => {
                const t = v.title?.toLowerCase() ?? "";
                const c = v.content?.toLowerCase() ?? "";
                const u = v.username?.toLowerCase() ?? "";
                return t.includes(kw) || c.includes(kw) || u.includes(kw);
            });
        }

        if (statusFilter !== "ALL") {
            result = result.filter((v) => v.status === statusFilter);
        }

        if (categoryFilter !== "ALL") {
            result = result.filter((v) => v.category === categoryFilter);
        }

        return result;
    }, [list, keyword, statusFilter, categoryFilter]);

    const pagedList = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredList.slice(start, start + rowsPerPage);
    }, [page, filteredList]);

    const pageCount = Math.ceil(filteredList.length / rowsPerPage) || 1;

    // --------------------------------------
    // 공통 DetailRow 컴포넌트
    // --------------------------------------
    const DetailRow = ({ label, value }) => (
        <Stack
            direction="row"
            spacing={2}
            sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}
        >
            <Typography sx={{ width: 90, color: "text.secondary" }}>
                {label}
            </Typography>
            <Box sx={{ flexGrow: 1 }}>{value}</Box>
        </Stack>
    );

    // --------------------------------------
    // UI 렌더링
    // --------------------------------------
    return (
        <>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                {/* 제목 */}
                <Box sx={{ mb: 3, textAlign: "center" }}>
                    <Typography variant="h5" 
                    fontWeight={700} 
                    sx={{
                            lineHeight: 1.3,
                            color: "primary.main",
                            mb: 1,
                            textAlign: { xs: "left", sm: "center" },
                        }}
                    >
                        문의 / 답변 관리
                    </Typography>
                    <Typography variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center" }}
                    >
                        사용자 문의 확인 및 답변 처리
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* 필터바 (MembersPage 스타일 동일 적용) */}
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
                    {/* 왼쪽 필터 */}
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
                            size="small"
                            label="상태"
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
                            <MenuItem value="WAIT">답변 대기</MenuItem>
                            <MenuItem value="ANSWERED">답변 완료</MenuItem>
                        </TextField>

                        <TextField
                            select
                            size="small"
                            label="카테고리"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
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
                            <MenuItem value="SERVICE">서비스 문의</MenuItem>
                            <MenuItem value="BUG">오류 신고</MenuItem>
                            <MenuItem value="SUGGEST">기능 제안</MenuItem>
                        </TextField>

                        <TextField
                            size="small"
                            placeholder="제목 / 내용 / 작성자 검색"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{
                                                color: "text.disabled",
                                                fontSize: 20,
                                            }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* 오른쪽 요약 */}
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ textAlign: "right" }}>
                            <Typography
                                sx={{ fontSize: "0.8rem", color: "text.secondary" }}
                            >
                                총 {filteredList.length}건
                            </Typography>
                            <Typography sx={{ fontSize: "0.8rem", fontWeight: 600 }}>
                                페이지 {page} / {pageCount}
                            </Typography>
                        </Box>

                        <Tooltip title="새로고침">
                            <IconButton onClick={loadInquiries}>
                                <RefreshIcon />
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
                            <TableRow
                                sx={{
                                    "& th": {
                                        fontWeight: 700,
                                        whiteSpace: "nowrap",
                                        fontSize: "0.8rem",
                                    },
                                }}
                            >
                                <TableCell>번호</TableCell>
                                <TableCell>제목</TableCell>
                                <TableCell>카테고리</TableCell>
                                <TableCell>작성자</TableCell>
                                <TableCell>상태</TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell align="right">액션</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {pagedList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                        {loading ? "불러오는 중..." : "데이터 없음"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pagedList.map((v) => (
                                    <TableRow key={v.inquiryId} hover>
                                        <TableCell>{v.inquiryId}</TableCell>
                                        <TableCell>{v.title}</TableCell>
                                        <TableCell>
                                            {CATEGORY_LABEL[v.category]}
                                        </TableCell>
                                        <TableCell>{v.username}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={STATUS_LABEL[v.status]}
                                                color={STATUS_COLOR[v.status]}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(v.createdAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="상세 / 답변">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleView(v.inquiryId)}
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="답변 작성/수정">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleView(v.inquiryId)}
                                                >
                                                    <ReplyIcon fontSize="small" />
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
                        onChange={(_, v) => setPage(v)}
                        size="small"
                        showFirstButton
                        showLastButton
                    />
                </Stack>
            </Paper>

            {/* 상세 다이얼로그 */}
            <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>문의 상세 / 답변</DialogTitle>

                <DialogContent dividers>
                    {selected && (
                        <Stack sx={{ px: 1 }} spacing={2}>
                            <DetailRow label="제목" value={selected.title} />
                            <DetailRow
                                label="카테고리"
                                value={CATEGORY_LABEL[selected.category]}
                            />
                            <DetailRow
                                label="작성자"
                                value={selected.username}
                            />
                            <DetailRow
                                label="등록일"
                                value={new Date(selected.createdAt).toLocaleString()}
                            />

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    backgroundColor: "grey.50",
                                    whiteSpace: "pre-line",
                                }}
                            >
                                {selected.content}
                            </Box>

                            <Typography fontWeight={600} sx={{ mt: 3 }}>
                                답변 작성 / 수정
                            </Typography>

                            <TextField
                                multiline
                                minRows={5}
                                fullWidth
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                placeholder="답변을 입력하세요."
                                sx={{ borderRadius: 2 }}
                            />
                        </Stack>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={() => setDetailOpen(false)}>
                        닫기
                    </Button>
                    <Button variant="contained" onClick={handleSaveAnswer}>
                        저장
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
                    severity={toast.severity}
                    variant="filled"
                    onClose={() => setToast((t) => ({ ...t, open: false }))}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </>
    );
}
