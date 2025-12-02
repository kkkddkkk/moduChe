import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Stack,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper as MuiPaper,
    alpha,
    useTheme,
} from "@mui/material";

import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { fetchInquiryDetail } from "../../api/inquiryApi/inquiryPublicApi";
import { deleteInquiry } from "../../api/inquiryApi/inquiryUserApi";

import { getUsernameFromToken, getRoleFromToken } from "../../utils/auth";

export default function InquiryDetailCard({ id }) {
    const theme = useTheme();

    const [data, setData] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    /** ▼ 콘솔: 어떤 id가 전달됐는지 확인 (이게 아주 중요함!) */
    console.log("DETAIL CARD RECEIVED ID:", id);

    /** ▼ 토큰 정보 */
    const token = localStorage.getItem("accessToken");
    const username = getUsernameFromToken(token);
    const role = getRoleFromToken(token);

    /** ▼ 관리자 판별 */
    useEffect(() => {
        if (role && (role.includes("ADMIN") || role.includes("SUPER_ADMIN"))) {
            setIsAdmin(true);
        }
    }, [role]);

    /** ▼ 상세 조회 */
    useEffect(() => {
        load();
    }, [id]); // ★ id가 변경될 때마다 다시 조회해야 함

    const load = async () => {
        try {
            const res = await fetchInquiryDetail(id);

            /** ▼ 상세 API 응답 찍기 */
            console.log(
                "DETAIL API RESPONSE:",
                JSON.stringify(res, null, 2)
            );

            setData(res);

            if (res.username === username) {
                setIsOwner(true);
            }
        } catch (e) {
            console.error("문의 조회 실패:", e);

            if (e.response?.status === 403) {
                alert("비밀글입니다. 접근 권한이 없습니다.");
                window.location.href = "/inquiry/list";
            }
        }
    };

    /** ▼ 삭제 */
    const handleDelete = async () => {
        try {
            await deleteInquiry(id);
            alert("문의가 삭제되었습니다.");
            window.location.href = "/inquiry/list";
        } catch (e) {
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    if (!data) return null;

    const inquiry = data;

    /** ▼ label 매핑 */
    const CATEGORY_LABEL = {
        SERVICE: "서비스 문의",
        BUG: "오류 신고",
        SUGGEST: "기능 제안",
    };

    const STATUS_TEXT = {
        WAIT: "답변 대기",
        ANSWERED: "답변 완료",
    };

    const STATUS_COLOR = {
        WAIT: "warning",
        ANSWERED: "success",
    };

    /** ▼ 비밀글 열람 가능 여부 */
    const canView = !inquiry.secret || isOwner || isAdmin;

    return (
        <MuiPaper
            elevation={2}
            sx={{
                width: "100%",
                p: 4,
                borderRadius: 3,
                border: `1px solid ${alpha("#000", 0.1)}`,
                backgroundColor: theme.palette.background.paper,
            }}
        >
            <Stack spacing={3}>
                {/* 제목 */}
                <Box>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                        {inquiry.title}
                        {inquiry.secret && (
                            <LockIcon
                                fontSize="small"
                                sx={{ ml: 1, color: theme.palette.error.main }}
                            />
                        )}
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <Chip
                            label={CATEGORY_LABEL[inquiry.category]}
                            variant="outlined"
                            size="small"
                        />
                        <Chip
                            label={STATUS_TEXT[inquiry.status]}
                            color={STATUS_COLOR[inquiry.status]}
                            size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                            {inquiry.createdAt?.replace("T", " ").slice(0, 16)}
                        </Typography>
                    </Stack>
                </Box>

                {/* 내용 */}
                <Box
                    sx={{
                        whiteSpace: "pre-line",
                        backgroundColor: alpha("#000", 0.03),
                        p: 2.5,
                        borderRadius: 2,
                        minHeight: "150px",
                    }}
                >
                    {canView ? (
                        <Typography>{inquiry.content}</Typography>
                    ) : (
                        <Typography color="text.secondary">
                            🔒 비밀글입니다. 작성자 또는 관리자만 열람 가능합니다.
                        </Typography>
                    )}
                </Box>

                {/* 답변 */}
                {inquiry.answer && (
                    <MuiPaper
                        elevation={0}
                        sx={{
                            borderRadius: 2,
                            border: `1px solid ${alpha("#000", 0.15)}`,
                            p: 3,
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                            📌 관리자 답변
                        </Typography>
                        <Typography sx={{ whiteSpace: "pre-line" }}>
                            {inquiry.answer.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {inquiry.answer.createdAt?.replace("T", " ").slice(0, 16)} ·{" "}
                            {inquiry.answer.answeredByUsername}
                        </Typography>
                    </MuiPaper>
                )}

                {(isOwner || isAdmin) && (
                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => (window.location.href = `/inquiry/${id}/edit`)}
                        >
                            수정하기
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setOpenDelete(true)}
                        >
                            삭제하기
                        </Button>
                    </Stack>
                )}
            </Stack>

            {/* 삭제 모달 */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
                <DialogContent sx={{ mt: 1 }}>
                    삭제된 문의는 복구할 수 없습니다.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)}>취소</Button>
                    <Button color="error" onClick={handleDelete}>
                        삭제하기
                    </Button>
                </DialogActions>
            </Dialog>
        </MuiPaper>
    );
}
