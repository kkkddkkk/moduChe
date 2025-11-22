// src/pages/Admin/InquiryPage.js
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
    Snackbar,
    Alert,
    alpha,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReplyIcon from "@mui/icons-material/Reply";

import Paper from "../../component/common/Paper";

import {
    fetchAdminInquiries,
    fetchAdminInquiryDetail,
    createAnswer,
    updateAnswer,
} from "../../api/inquiryApi/inquiryApi";

/* ------------------------------
   상수 정의
-------------------------------- */
const INQUIRY_STATUS_LABEL = {
    WAIT: "답변 대기",
    WAITING: "답변 대기",
    ANSWERED: "답변 완료",
};

const INQUIRY_STATUS_COLOR = {
    WAIT: "warning",
    WAITING: "warning",
    ANSWERED: "success",
};

const INQUIRY_CATEGORY_LABEL = {
    SERVICE: "서비스 문의",
    BUG: "오류 신고",
    SUGGEST: "기능 제안",
};

export default function InquiryPage() {
    /* ------------------------------
       상태 정의
    ------------------------------ */
    const [list, setList] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [categoryFilter, setCategoryFilter] = useState("ALL");

    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const [loading, setLoading] = useState(false);

    // 상세 다이얼로그
    const [detailOpen, setDetailOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    // 답변 입력
    const [answerText, setAnswerText] = useState("");

    // 토스트
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    /* ------------------------------
       1) 관리자 문의 목록 조회
    ------------------------------ */
    const loadInquiries = async () => {
        try {
            setLoading(true);

            const res = await fetchAdminInquiries({
                page: 0,
                size: 9999, // 관리자니까 전체 불러오고 클라이언트에서 필터링
            });

            setList(res?.content ?? []);
        } catch (e) {
            console.error("문의 목록 로드 실패:", e);
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

    /* ------------------------------
       2) 관리자 상세 조회 + 답변 준비
    ------------------------------ */
    const handleView = async (id) => {
        try {
            const data = await fetchAdminInquiryDetail(id);
            setSelected(data);
            setAnswerText(data.answer?.content || "");
            setDetailOpen(true);
        } catch (e) {
            console.error("상세 조회 실패:", e);
            setToast({
                open: true,
                message: "상세 조회에 실패했습니다.",
                severity: "error",
            });
        }
    };

    /* ------------------------------
       3) 답변 저장
    ------------------------------ */
    const handleSaveAnswer = async () => {
        if (!selected) return;

        try {
            if (selected.answer) {
                // 기존 답변 수정
                await updateAnswer(selected.answer.answerId, {
                    content: answerText,
                });
            } else {
                // 신규 답변 작성
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
        } catch (e) {
            console.error("답변 저장 실패:", e);
            setToast({
                open: true,
                message: "답변 저장 중 오류가 발생했습니다.",
                severity: "error",
            });
        }
    };

    /* ------------------------------
       4) 검색/필터링/페이지네이션
    ------------------------------ */
    const filteredList = useMemo(() => {
        let result = [...list];
        const kw = keyword.trim().toLowerCase();

        if (kw.length > 0) {
            result = result.filter((row) => {
                const t = row.title?.toLowerCase() ?? "";
                const c = row.content?.toLowerCase() ?? "";
                const u = row.username?.toLowerCase() ?? "";
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

    /* ------------------------------
       UI 렌더링
    ------------------------------ */

    const DetailChip = ({ label, color }) => (
        <Chip
            size="small"
            label={label}
            color={color}
            sx={{ fontSize: "0.75rem", fontWeight: 600 }}
        />
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
                {/* 제목 */}
                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        textAlign="center"
                        sx={{ mb: 1 }}
                    >
                        문의 / 답변 관리
                    </Typography>
                    <Typography
                        variant="body2"
                        textAlign="center"
                        color="text.secondary"
                    >
                        사용자 문의 확인 및 답변 등록/수정
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* 필터 바 */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        flexWrap: "wrap",
                        mb: 2,
                    }}
                >
                    <TextField
                        select
                        size="small"
                        label="상태"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        sx={{ minWidth: 120 }}
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
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="ALL">전체</MenuItem>
                        <MenuItem value="SERVICE">서비스 문의</MenuItem>
                        <MenuItem value="BUG">오류 신고</MenuItem>
                        <MenuItem value="SUGGEST">기능 제안</MenuItem>
                    </TextField>

                    <TextField
                        size="small"
                        placeholder="검색어 입력"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ minWidth: 260 }}
                    />

                    <Tooltip title="새로고침">
                        <IconButton onClick={loadInquiries} sx={{ ml: "auto" }}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* 테이블 */}
                <Box sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow
                                sx={{
                                    backgroundColor: alpha("#000", 0.03),
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
                                    <TableCell colSpan={7} align="center">
                                        {loading
                                            ? "불러오는 중..."
                                            : "데이터 없음"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pagedList.map((v) => (
                                    <TableRow key={v.inquiryId} hover>
                                        <TableCell>{v.inquiryId}</TableCell>
                                        <TableCell>{v.title}</TableCell>
                                        <TableCell>
                                            {INQUIRY_CATEGORY_LABEL[v.category]}
                                        </TableCell>
                                        <TableCell>{v.username}</TableCell>
                                        <TableCell>
                                            <DetailChip
                                                label={
                                                    INQUIRY_STATUS_LABEL[
                                                        v.status
                                                    ]
                                                }
                                                color={
                                                    INQUIRY_STATUS_COLOR[
                                                        v.status
                                                    ]
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                v.createdAt
                                            ).toLocaleString()}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="상세 보기">
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        handleView(v.inquiryId)
                                                    }
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="답변 작성/수정">
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        handleView(v.inquiryId)
                                                    }
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

                {/* 페이지네이션 */}
                <Stack mt={2} alignItems="center">
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(_, v) => setPage(v)}
                    />
                </Stack>
            </Paper>

            {/* 상세 + 답변 다이얼로그 */}
            <Dialog
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700 }}>
                    문의 상세 / 답변
                </DialogTitle>

                <DialogContent dividers sx={{ backgroundColor: "#fafafa" }}>
                    {selected && (
                        <>
                            {/* Inquiry Card UI */}
                            <Box
                                sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: 2,
                                    p: 2,
                                    backgroundColor: "white",
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    sx={{ mb: 1 }}
                                >
                                    {selected.title}
                                </Typography>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ mb: 1 }}
                                >
                                    <Chip
                                        size="small"
                                        label={
                                            INQUIRY_CATEGORY_LABEL[
                                                selected.category
                                            ]
                                        }
                                    />
                                    <Chip
                                        size="small"
                                        color={
                                            INQUIRY_STATUS_COLOR[
                                                selected.status
                                            ]
                                        }
                                        label={
                                            INQUIRY_STATUS_LABEL[
                                                selected.status
                                            ]
                                        }
                                    />
                                </Stack>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                >
                                    {new Date(
                                        selected.createdAt
                                    ).toLocaleString()}
                                </Typography>

                                <Box
                                    sx={{
                                        backgroundColor: alpha("#000", 0.03),
                                        p: 2,
                                        borderRadius: 2,
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    {selected.content}
                                </Box>
                            </Box>

                            {/* 답변 입력 */}
                            <Typography fontWeight={600} sx={{ mb: 1 }}>
                                답변 작성 / 수정
                            </Typography>

                            <TextField
                                multiline
                                fullWidth
                                minRows={5}
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                placeholder="답변 내용을 입력하세요."
                                sx={{
                                    backgroundColor: "white",
                                    borderRadius: 2,
                                }}
                            />
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={() => setDetailOpen(false)}
                    >
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
                autoHideDuration={2000}
                onClose={() => setToast({ ...toast, open: false })}
            >
                <Alert
                    severity={toast.severity}
                    onClose={() => setToast({ ...toast, open: false })}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </>
    );
}
