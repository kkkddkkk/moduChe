// src/pages/Admin/AdministratorPage.js
import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Stack,
    IconButton,
    Tooltip,
    TextField,
    MenuItem,
    Chip,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Pagination,
    InputAdornment,
    Button,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/PersonAddAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/FileDownload";

import Paper from "../../component/common/Paper";
import { fetchAdmins, patchAdmin, deleteAdmin } from "../../api/admin/index";

const ROLE_LABEL = {
    SUPER_ADMIN: "최고관리자",
    OPERATOR: "운영",
    CS_MANAGER: "고객지원",
};
const STATUS_LABEL = { ACTIVE: "사용 중", DISABLED: "중지" };
const STATUS_COLOR = { ACTIVE: "success", DISABLED: "default" };

export default function AdministratorPage() {
    // 서버 데이터
    const [admins, setAdmins] = useState([]);
    // 필터
    const [keyword, setKeyword] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    // 페이징
    const [page, setPage] = useState(1); // UI 1-base
    const rowsPerPage = 5;
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    // 토스트
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // 상세 모달
    const [viewTarget, setViewTarget] = useState(null); // { userId, username, ... }

    // 삭제 다이얼로그
    const [deleteTarget, setDeleteTarget] = useState(null); // { userId, username, name, ... }

    // 서버 응답 -> View 모델
    const toView = (r) => {
        if (!r) return null;

        const userId = r.user_id ?? r.userId ?? r.id ?? null;
        const username = r.username ?? "";
        const roleId = r.role_id ?? r.roleId ?? null;

        const roleCode =
            roleId === 1
                ? "SUPER_ADMIN"
                : roleId === 2
                ? "OPERATOR"
                : roleId === 3
                ? "PERSONAL"
                : roleId === 4
                ? "FACILITY"
                : `${roleId ?? ""}`;

        const createdAtRaw = r.created_at ?? r.createdAt ?? "";
        const createdAt = createdAtRaw
            ? String(createdAtRaw).replace("T", " ").slice(0, 16)
            : "";

        return {
            userId,
            username,
            name: r.name ?? r.username ?? "",
            email: r.email ?? "",
            phone: r.phone ?? "",
            roleId,
            role: roleCode,
            status: r.status ?? "ACTIVE",
            createdAt,
            _raw: r,
        };
    };

    // 목록 로드
    const loadAdmins = async (opts = {}) => {
        setLoading(true);
        try {
            const resp = await fetchAdmins({
                page: (opts.page ?? page) - 1, // API 0-base
                size: rowsPerPage,
                q: keyword || undefined,
                status: statusFilter === "ALL" ? undefined : statusFilter,
                role: roleFilter === "ALL" ? undefined : roleFilter,
            });

            const content = resp?.content ?? [];
            const mapped = content.map(toView);
            setAdmins(mapped);
            setTotalElements(resp?.totalElements ?? mapped.length);
        } catch (err) {
            console.error("관리자 목록 불러오기 실패:", err);
            setToast({
                open: true,
                message: "관리자 목록 불러오기 실패",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdmins({ page });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        setPage(1);
        loadAdmins({ page: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword, roleFilter, statusFilter]);

    // postMessage로 생성 결과 수신
    useEffect(() => {
        const onMessage = (event) => {
            if (event.origin !== window.location.origin) return;
            const { type, payload } = event.data || {};
            if (type === "ADMIN_CREATED" && payload) {
                const v = toView(payload);
                setAdmins((prev) => {
                    const dup = prev.some(
                        (a) =>
                            a.userId === v.userId ||
                            (!!v.email && a.email === v.email)
                    );
                    return dup ? prev : [v, ...prev];
                });
                setToast({
                    open: true,
                    message: "관리자가 추가되었습니다.",
                    severity: "success",
                });
            }
        };
        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, []);

    // 액션
    const handleRefresh = () => loadAdmins({ page: 1 });
    const handleExport = () => console.log("⬇ 관리자 계정 목록 내보내기");

    // 상세 모달 열기
    const handleView = (userId) => {
        const t = admins.find((a) => a.userId === userId);
        if (!t) {
            setToast({
                open: true,
                message: "대상을 찾을 수 없습니다.",
                severity: "error",
            });
            return;
        }
        setViewTarget(t);
    };

    const handleToggleEnabled = async (userId, currentStatus) => {
        const next = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";

        if (!userId || Number.isNaN(Number(userId))) {
            // 임시 레코드 fallback
            setAdmins((prev) =>
                prev.map((a) =>
                    a.userId === userId ? { ...a, status: next } : a
                )
            );
            setViewTarget((v) =>
                v && v.userId === userId ? { ...v, status: next } : v
            );
            setToast({
                open: true,
                message:
                    next === "ACTIVE"
                        ? "계정을 활성화했어요."
                        : "계정을 중지했어요.",
                severity: "success",
            });
            return;
        }

        try {
            await patchAdmin(Number(userId), { status: next });
            setAdmins((prev) =>
                prev.map((a) =>
                    a.userId === userId ? { ...a, status: next } : a
                )
            );
            setViewTarget((v) =>
                v && v.userId === userId ? { ...v, status: next } : v
            );
            setToast({
                open: true,
                message:
                    next === "ACTIVE" ? "계정 활성화 완료" : "계정 중지 완료",
                severity: "success",
            });
        } catch (err) {
            console.error("상태 변경 실패:", err);
            setToast({
                open: true,
                message: "상태 변경 실패",
                severity: "error",
            });
        }
    };

    const askDelete = (userId) => {
        const target = admins.find((a) => a.userId === userId);
        if (target) setDeleteTarget(target);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        const { userId } = deleteTarget;

        if (!userId || Number.isNaN(Number(userId))) {
            // 임시 레코드 삭제
            setAdmins((prev) => prev.filter((a) => a.userId !== userId));
            setDeleteTarget(null);
            setViewTarget((v) => (v && v.userId === userId ? null : v));
            setToast({
                open: true,
                message: "관리자 계정을 삭제했습니다.",
                severity: "success",
            });
            return;
        }

        try {
            await deleteAdmin(Number(userId));
            setAdmins((prev) => prev.filter((a) => a.userId !== userId));
            setViewTarget((v) => (v && v.userId === userId ? null : v));
            setToast({ open: true, message: "삭제 완료", severity: "success" });
        } catch (err) {
            console.error("삭제 실패:", err);
            setToast({ open: true, message: "삭제 실패", severity: "error" });
        } finally {
            setDeleteTarget(null);
        }
    };

    // 클라 필터
    const filteredList = useMemo(() => {
        const kw = keyword.trim().toLowerCase();
        return admins.filter((a) => {
            const matchKeyword =
                kw === "" ||
                (a.username && a.username.toLowerCase().includes(kw)) ||
                (a.name && a.name.toLowerCase().includes(kw)) ||
                (a.email && a.email.toLowerCase().includes(kw));

            const matchRole =
                roleFilter === "ALL"
                    ? true
                    : a.role === roleFilter || String(a.roleId) === roleFilter;

            const matchStatus =
                statusFilter === "ALL" ? true : a.status === statusFilter;

            return matchKeyword && matchRole && matchStatus;
        });
    }, [admins, keyword, roleFilter, statusFilter]);

    // 페이지 슬라이스는 UI용
    const pagedList = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredList.slice(start, start + rowsPerPage);
    }, [filteredList, page]);

    const pageCount = Math.max(1, Math.ceil(totalElements / rowsPerPage));

    useEffect(() => setPage(1), [keyword, roleFilter, statusFilter]);

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
            {/* 헤더 */}
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
                    관리자 계정 관리
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        lineHeight: 1.5,
                        textAlign: { xs: "left", sm: "center" },
                    }}
                >
                    관리자 계정을 생성하고 권한을 부여하거나 비활성화할 수
                    있습니다.
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* 필터/액션 바 */}
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
                {/* 왼쪽 */}
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
                        label="권한"
                        size="small"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
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
                            "& .MuiInputLabel-root": { fontSize: "0.75rem" },
                        }}
                    >
                        <MenuItem value="ALL">전체</MenuItem>
                        <MenuItem value="SUPER_ADMIN">최고관리자</MenuItem>
                        <MenuItem value="OPERATOR">운영</MenuItem>
                        <MenuItem value="CS_MANAGER">고객지원</MenuItem>
                        <MenuItem value="1">role_id = 1</MenuItem>
                        <MenuItem value="2">role_id = 2</MenuItem>
                    </TextField>

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
                            "& .MuiInputLabel-root": { fontSize: "0.75rem" },
                        }}
                    >
                        <MenuItem value="ALL">전체</MenuItem>
                        <MenuItem value="ACTIVE">사용 중</MenuItem>
                        <MenuItem value="DISABLED">중지</MenuItem>
                    </TextField>

                    <TextField
                        size="small"
                        placeholder="계정명(username) / 이름 / 이메일 검색"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        sx={{
                            minWidth: { xs: "100%", md: 280 },
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

                {/* 오른쪽 */}
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
                    <Box sx={{ textAlign: "right", mr: 1 }}>
                        <Typography
                            sx={{
                                fontSize: "0.8rem",
                                color: "text.secondary",
                                fontWeight: 400,
                                whiteSpace: "nowrap",
                            }}
                        >
                            총 {filteredList.length}명
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                color: "text.primary",
                            }}
                        >
                            페이지 {page} / {pageCount}
                        </Typography>
                    </Box>

                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            px: 1.5,
                            py: 1,
                        }}
                        onClick={() => {
                            const w = 520,
                                h = 640;
                            const dualScreenLeft =
                                window.screenLeft ?? window.screenX ?? 0;
                            const dualScreenTop =
                                window.screenTop ?? window.screenY ?? 0;
                            const viewportW =
                                window.innerWidth ??
                                document.documentElement?.clientWidth ??
                                window.screen?.width ??
                                0;
                            const viewportH =
                                window.innerHeight ??
                                document.documentElement?.clientHeight ??
                                window.screen?.height ??
                                0;
                            const availW =
                                (window.screen?.availWidth ?? viewportW) || 1;
                            const systemZoom = viewportW / availW;
                            const left =
                                (viewportW - w) / 2 / (systemZoom || 1) +
                                dualScreenLeft;
                            const top =
                                (viewportH - h) / 2 / (systemZoom || 1) +
                                dualScreenTop;
                            window.open(
                                "/admin-window/admins/new",
                                "AdminCreateWindow",
                                `scrollbars=yes,width=${w},height=${h},top=${top},left=${left},noopener,noreferrer`
                            );
                        }}
                    >
                        새 관리자 추가
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
                <Table stickyHeader size="small">
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
                            <TableCell>UID(계정명)</TableCell>
                            <TableCell>이름</TableCell>
                            <TableCell>이메일</TableCell>
                            <TableCell>역할</TableCell>
                            <TableCell>상태</TableCell>
                            <TableCell>생성일</TableCell>
                            <TableCell align="right">액션</TableCell>
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
                                    {loading
                                        ? "불러오는 중..."
                                        : "조건에 맞는 관리자가 없습니다."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            pagedList.map((admin, idx) => (
                                <TableRow
                                    key={admin.userId ?? `row-${idx}`}
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
                                        {admin.username || "-"}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {admin.name}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            maxWidth: 220,
                                            fontSize: "0.8rem",
                                            color: "text.secondary",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {admin.email}
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={
                                                ROLE_LABEL[admin.role] ||
                                                admin.role
                                            }
                                            size="small"
                                            color={
                                                admin.role === "SUPER_ADMIN"
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

                                    <TableCell>
                                        <Chip
                                            label={STATUS_LABEL[admin.status]}
                                            size="small"
                                            color={STATUS_COLOR[admin.status]}
                                            icon={
                                                admin.status === "ACTIVE" ? (
                                                    <CheckCircleIcon
                                                        sx={{ fontSize: 16 }}
                                                    />
                                                ) : (
                                                    <BlockIcon
                                                        sx={{ fontSize: 16 }}
                                                    />
                                                )
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
                                        {admin.createdAt}
                                    </TableCell>

                                    <TableCell align="right">
                                        <Tooltip title="상세 보기">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleView(admin.userId)
                                                }
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip
                                            title={
                                                admin.status === "DISABLED"
                                                    ? "계정 활성화"
                                                    : "계정 중지"
                                            }
                                        >
                                            <IconButton
                                                size="small"
                                                color={
                                                    admin.status === "DISABLED"
                                                        ? "success"
                                                        : "warning"
                                                }
                                                onClick={() =>
                                                    handleToggleEnabled(
                                                        admin.userId,
                                                        admin.status
                                                    )
                                                }
                                                sx={{ ml: 0.5 }}
                                            >
                                                <BlockIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="완전 삭제">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() =>
                                                    askDelete(admin.userId)
                                                }
                                                sx={{ ml: 0.5 }}
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

            {/* 상세 보기 모달 */}
            <Dialog
                open={Boolean(viewTarget)}
                onClose={() => setViewTarget(null)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700 }}>관리자 상세</DialogTitle>
                <DialogContent dividers>
                    {viewTarget && (
                        <Stack spacing={1.25}>
                            <Typography>
                                <b>UID</b>: {viewTarget.username || "-"}
                            </Typography>
                            <Typography>
                                <b>이름</b>: {viewTarget.name || "-"}
                            </Typography>
                            <Typography>
                                <b>이메일</b>: {viewTarget.email || "-"}
                            </Typography>
                            <Typography>
                                <b>전화</b>: {viewTarget.phone || "-"}
                            </Typography>
                            <Typography>
                                <b>역할</b>:{" "}
                                {ROLE_LABEL[viewTarget.role] ||
                                    viewTarget.role ||
                                    "-"}
                            </Typography>
                            <Typography>
                                <b>상태</b>:{" "}
                                {STATUS_LABEL[viewTarget.status] ||
                                    viewTarget.status ||
                                    "-"}
                            </Typography>
                            <Typography>
                                <b>생성일</b>: {viewTarget.createdAt || "-"}
                            </Typography>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewTarget(null)}>닫기</Button>
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
                    관리자 계정 삭제
                </DialogTitle>
                <DialogContent dividers>
                    {deleteTarget && (
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1.5 }}>
                                아래 계정을 정말로 삭제할까요? 이 작업은 되돌릴
                                수 없습니다.
                            </Typography>
                            <Stack spacing={0.5}>
                                <Typography sx={{ fontFamily: "monospace" }}>
                                    {deleteTarget.username} (ID:{" "}
                                    {deleteTarget.userId})
                                </Typography>
                                <Typography color="text.secondary">
                                    {deleteTarget.name} · {deleteTarget.email}
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
        </Paper>
    );
}
