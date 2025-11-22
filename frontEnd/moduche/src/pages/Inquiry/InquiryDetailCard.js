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

import {
    fetchInquiryDetail,
    deleteInquiry,
} from "../../api/inquiryApi/inquiryApi";

import { getUsernameFromToken, getRoleFromToken } from "../../utils/auth";

export default function InquiryDetailCard({ id }) {
    const theme = useTheme();

    const [data, setData] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    /** ▼ 토큰 정보 */
    const token = localStorage.getItem("accessToken");
    const username = getUsernameFromToken(token);
    const role = getRoleFromToken(token);

    /** ▼ role 반영(관리자 판별) */
    useEffect(() => {
        if (role === "SUPER_ADMIN" || role === "ADMIN" || role === "OPERATOR") {
            setIsAdmin(true);
        }
    }, [role]);

    /** ▼ isAdmin 확정 후 조회 */
    useEffect(() => {
        load();
    }, [isAdmin]);

    /** ▼ 문의 상세 조회 (단일 API) */
    const load = async () => {
        try {
            const res = await fetchInquiryDetail(id);
            setData(res);

            if (res.username === username) {
                setIsOwner(true);
            }
        } catch (e) {
            console.error("문의 조회 실패:", e);

            // 백엔드 비밀글 권한 거부 → 403 반환
            if (e.response?.status === 403) {
                alert("비밀글을 볼 수 있는 권한이 없습니다.");
                window.location.href = "/inquiry/list";
            }
        }
    };

    /** ▼ 삭제 처리 */
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

    const CATEGORY_LABEL = {
        SERVICE: "서비스 문의",
        BUG: "오류 신고",
        SUGGEST: "기능 제안",
    };

    const STATUS_TEXT = {
        WAIT: "답변 대기",
        WAITING: "답변 대기",
        ANSWERED: "답변 완료",
    };

    const STATUS_COLOR = {
        WAIT: "warning",
        WAITING: "warning",
        ANSWERED: "success",
    };

    /** ▼ 내용 볼 권한(백엔드 보안 유지, 프론트는 UI용) */
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
                            {inquiry.createdAt}
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
                            🔒 비밀글입니다. 작성자 또는 관리자만 열람
                            가능합니다.
                        </Typography>
                    )}
                </Box>

                {/* 수정 / 삭제 */}
                {(isOwner || isAdmin) && (
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1}
                    >
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() =>
                                (window.location.href = `/inquiry/${id}/edit`)
                            }
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
