// src/pages/Admin/MembersPage.js
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
    Box,
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
    Typography,
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

import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/DeleteForever";

import Paper from "../../component/common/Paper";
import communityHttp from "../../api/communityAPI/communityHttp";

const USERS_ENDPOINT = "/users"; // baseURL이 /api 라면 최종 /api/users

const STATUS_COLOR = {
    ACTIVE: "success",
    SUSPENDED: "error",
};

const ROLE_LABEL = {
    USER: "일반",
    ADMIN: "관리자",
};

// numeric userId -> UID string (U0001)
const formatUid = (userId) => {
    if (userId === null || userId === undefined) return "";
    return "U" + String(userId).padStart(4, "0");
};

export default function MembersPage() {
    // data & UI state
    const [members, setMembers] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // detail / delete / toast
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [targetMember, setTargetMember] = useState(null);
    const [confirmText, setConfirmText] = useState("");

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    // avoid double fetch
    const initialFetchRef = useRef(false);
    const fetchingRef = useRef(false);

    // --- API: list
    const fetchUsers = async (p = page) => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;
        setLoading(true);
        try {
            const resp = await communityHttp.get(USERS_ENDPOINT, {
                params: {
                    page: Math.max(0, p - 1),
                    size: rowsPerPage,
                    search: keyword || undefined,
                    role: roleFilter === "ALL" ? undefined : roleFilter,
                    status: statusFilter === "ALL" ? undefined : statusFilter,
                },
            });

            const data = resp.data;
            const list = data.content || data;

            const mapped = (list || []).map((u) => ({
                uid: formatUid(u.userId),
                userId: u.userId,
                username: u.username,
                name: u.name,
                email: u.email,
                phone: u.phone,
                birth: u.birth || null,
                role:
                    u.roleName ||
                    u.roleCode ||
                    (u.role && u.role.roleCode) ||
                    "USER",
                roleId: u.roleId || (u.role && u.role.roleId) || null,
                status: u.status || "ACTIVE",
                joinedAt: u.createdAt
                    ? new Date(u.createdAt).toLocaleString()
                    : u.joinedAt || "",
                raw: u,
            }));
            setMembers(mapped);

            const computedTotalPages =
                data && data.totalPages != null
                    ? data.totalPages
                    : Math.max(1, Math.ceil(mapped.length / rowsPerPage));
            setTotalPages(computedTotalPages);
        } catch (e) {
            console.error(
                "회원 목록 로드 실패",
                e.response?.status,
                (e.response?.config?.baseURL || "") +
                    (e.response?.config?.url || ""),
                e.response?.data || e.message
            );
            setToast({
                open: true,
                message: "회원 목록을 불러오지 못했습니다.",
                severity: "error",
            });
        } finally {
            setLoading(false);
            fetchingRef.current = false;
        }
    };

    // --- API: detail
    const fetchUserDetail = async (userId) => {
        try {
            const resp = await communityHttp.get(`${USERS_ENDPOINT}/${userId}`);
            const u = resp.data;
            const mapped = {
                uid: formatUid(u.userId),
                userId: u.userId,
                username: u.username,
                name: u.name,
                email: u.email,
                phone: u.phone,
                birth: u.birth || null,
                role: u.roleName || (u.role && u.role.roleCode) || "USER",
                roleId: u.roleId || (u.role && u.role.roleId) || null,
                status: u.status || "ACTIVE",
                joinedAt: u.createdAt
                    ? new Date(u.createdAt).toLocaleString()
                    : "",
                raw: u,
            };
            setSelectedMember(mapped);
            setDetailOpen(true);
        } catch (e) {
            console.error(
                "상세조회 실패",
                e.response?.status,
                (e.response?.config?.baseURL || "") +
                    (e.response?.config?.url || ""),
                e.response?.data || e.message
            );
            setToast({
                open: true,
                message: "회원 상세 정보를 불러오지 못했습니다.",
                severity: "error",
            });
        }
    };

    // mount: initial load
    useEffect(() => {
        if (initialFetchRef.current) return;
        initialFetchRef.current = true;
        fetchUsers(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // refetch when paging/filter/search change
    useEffect(() => {
        fetchUsers(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, keyword, roleFilter, statusFilter]);

    // actions
    const handleRefresh = () => {
        setPage(1);
        fetchUsers(1);
    };

    const handleView = async (uidOrUserId) => {
        let numericId = null;
        if (typeof uidOrUserId === "number") numericId = uidOrUserId;
        else if (String(uidOrUserId).startsWith("U"))
            numericId = parseInt(String(uidOrUserId).slice(1), 10);
        else numericId = parseInt(uidOrUserId, 10);

        if (!numericId) {
            const found = members.find((m) => m.uid === uidOrUserId);
            setSelectedMember(found || null);
            setDetailOpen(true);
            return;
        }
        await fetchUserDetail(numericId);
    };

    const handleToggleBlock = async (uid, currentStatus) => {
        let numericId = null;
        if (typeof uid === "number") numericId = uid;
        else if (String(uid).startsWith("U"))
            numericId = parseInt(String(uid).slice(1), 10);
        if (!numericId) {
            console.warn("Invalid id for toggle:", uid);
            return;
        }

        const newStatus =
            currentStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
        try {
            const existingResp = await communityHttp.get(
                `${USERS_ENDPOINT}/${numericId}`
            );
            const existing = existingResp.data;
            const payload = {
                userId: existing.userId,
                username: existing.username,
                name: existing.name,
                email: existing.email,
                phone: existing.phone,
                status: newStatus,
                roleId:
                    existing.roleId ||
                    (existing.role && existing.role.roleId) ||
                    null,
            };
            await communityHttp.put(`${USERS_ENDPOINT}/${numericId}`, payload);
            await fetchUsers(page);
            if (selectedMember?.userId === numericId)
                await fetchUserDetail(numericId);
            setToast({
                open: true,
                message: "상태 변경이 적용되었습니다.",
                severity: "success",
            });
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
                message: "상태 변경에 실패했습니다.",
                severity: "error",
            });
        }
    };

    const openDeleteDialog = (member) => {
        setTargetMember(member);
        setConfirmText("");
        setDeleteOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteOpen(false);
        setTargetMember(null);
        setConfirmText("");
    };

    const handleConfirmDelete = async () => {
        if (!targetMember) return;
        if (targetMember.role === "ADMIN") {
            setToast({
                open: true,
                message: "관리자 계정은 삭제할 수 없습니다.",
                severity: "warning",
            });
            return;
        }

        let numericId = targetMember.userId;
        if (
            !numericId &&
            targetMember.uid &&
            targetMember.uid.startsWith("U")
        ) {
            numericId = parseInt(targetMember.uid.slice(1), 10);
        }

        if (!numericId) {
            // client-only deletion fallback
            setMembers((prev) =>
                prev.filter((m) => m.uid !== targetMember.uid)
            );
            if (selectedMember?.uid === targetMember.uid) setDetailOpen(false);
            closeDeleteDialog();
            setToast({
                open: true,
                message: "회원이 삭제되었습니다 (클라이언트에서만).",
                severity: "info",
            });
            return;
        }

        try {
            await communityHttp.delete(`${USERS_ENDPOINT}/${numericId}`);
            await fetchUsers(Math.max(1, page));
            if (selectedMember?.userId === numericId) setDetailOpen(false);
            closeDeleteDialog();
            setToast({
                open: true,
                message: "회원이 삭제되었습니다.",
                severity: "success",
            });
        } catch (e) {
            console.error(
                "삭제 실패",
                e.response?.status,
                (e.response?.config?.baseURL || "") +
                    (e.response?.config?.url || ""),
                e.response?.data || e.message
            );
            setToast({
                open: true,
                message: "회원 삭제에 실패했습니다.",
                severity: "error",
            });
        }
    };

    // client-side filters
    const filteredList = useMemo(() => {
        const kw = keyword.trim().toLowerCase();
        return members.filter((m) => {
            const matchKeyword =
                kw === "" ||
                (m.name && m.name.toLowerCase().includes(kw)) ||
                (m.email && m.email.toLowerCase().includes(kw)) ||
                (m.uid && m.uid.toLowerCase().includes(kw));

            const matchRole =
                roleFilter === "ALL" ? true : m.role === roleFilter;
            const matchStatus =
                statusFilter === "ALL" ? true : m.status === statusFilter;
            return matchKeyword && matchRole && matchStatus;
        });
    }, [members, keyword, roleFilter, statusFilter]);

    const pagedList = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredList.slice(start, start + rowsPerPage);
    }, [filteredList, page]);

    const pageCount = Math.ceil(filteredList.length / rowsPerPage) || 1;

    useEffect(() => {
        setPage(1);
    }, [keyword, roleFilter, statusFilter, members]);

    // small reusable detail row
    const DetailRow = ({ label, children, verticalAlign = "center" }) => (
        <Stack
            direction="row"
            alignItems={verticalAlign}
            spacing={2}
            sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}
        >
            <Typography
                variant="body2"
                sx={{
                    width: 90,
                    minWidth: 90,
                    color: "text.secondary",
                    fontWeight: 500,
                    lineHeight: 1.4,
                }}
            >
                {label}
            </Typography>
            <Box
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    wordBreak: "break-word",
                    lineHeight: 1.5,
                }}
            >
                {children}
            </Box>
        </Stack>
    );

    // ---------- RENDER ----------
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
                {/* Header */}
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
                        회원 관리
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            lineHeight: 1.5,
                            textAlign: { xs: "left", sm: "center" },
                        }}
                    >
                        가입된 사용자 목록을 확인하고 관리할 수 있습니다.
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Option Bar */}
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
                    {/* Left: filters + search */}
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
                                "& .MuiInputLabel-root": {
                                    fontSize: "0.75rem",
                                },
                            }}
                        >
                            <MenuItem value="ALL">전체</MenuItem>
                            <MenuItem value="USER">일반</MenuItem>
                            <MenuItem value="ADMIN">관리자</MenuItem>
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
                                "& .MuiInputLabel-root": {
                                    fontSize: "0.75rem",
                                },
                            }}
                        >
                            <MenuItem value="ALL">전체</MenuItem>
                            <MenuItem value="ACTIVE">정상</MenuItem>
                            <MenuItem value="SUSPENDED">정지</MenuItem>
                        </TextField>

                        <TextField
                            size="small"
                            placeholder="이름 / 이메일 / UID 검색"
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

                    {/* Right: summary + refresh */}
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

                {/* Table */}
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
                                <TableCell sx={{ minWidth: 120 }}>
                                    UID
                                </TableCell>
                                <TableCell sx={{ minWidth: 140 }}>
                                    이름
                                </TableCell>
                                <TableCell sx={{ minWidth: 180 }}>
                                    이메일
                                </TableCell>
                                <TableCell sx={{ minWidth: 100 }}>
                                    권한
                                </TableCell>
                                <TableCell sx={{ minWidth: 100 }}>
                                    상태
                                </TableCell>
                                <TableCell sx={{ minWidth: 130 }}>
                                    가입일
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
                                        sx={{ py: 6, color: "text.secondary" }}
                                    >
                                        {loading
                                            ? "불러오는 중..."
                                            : "조건에 맞는 회원이 없습니다."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pagedList.map((member) => {
                                    const isAdmin = member.role === "ADMIN";
                                    return (
                                        <TableRow
                                            key={member.uid}
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
                                                {member.uid}
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: "0.9rem",
                                                }}
                                            >
                                                {member.name}
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    maxWidth: 200,
                                                    fontSize: "0.8rem",
                                                    color: "text.secondary",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {member.email}
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={
                                                        ROLE_LABEL[
                                                            member.role
                                                        ] || member.role
                                                    }
                                                    size="small"
                                                    color={
                                                        member.role === "ADMIN"
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
                                                    label={
                                                        member.status ===
                                                        "ACTIVE"
                                                            ? "정상"
                                                            : "정지"
                                                    }
                                                    size="small"
                                                    color={
                                                        STATUS_COLOR[
                                                            member.status
                                                        ] || "default"
                                                    }
                                                    icon={
                                                        member.status ===
                                                        "ACTIVE" ? (
                                                            <CheckCircleIcon
                                                                sx={{
                                                                    fontSize: 16,
                                                                }}
                                                            />
                                                        ) : (
                                                            <BlockIcon
                                                                sx={{
                                                                    fontSize: 16,
                                                                }}
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
                                                {member.joinedAt}
                                            </TableCell>

                                            <TableCell align="right">
                                                <Tooltip title="상세 보기">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            handleView(
                                                                member.userId ||
                                                                    member.uid
                                                            )
                                                        }
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip
                                                    title={
                                                        member.status ===
                                                        "SUSPENDED"
                                                            ? "정지 해제"
                                                            : "계정 정지"
                                                    }
                                                >
                                                    <IconButton
                                                        size="small"
                                                        color={
                                                            member.status ===
                                                            "SUSPENDED"
                                                                ? "success"
                                                                : "error"
                                                        }
                                                        onClick={() =>
                                                            handleToggleBlock(
                                                                member.userId ||
                                                                    member.uid,
                                                                member.status
                                                            )
                                                        }
                                                        sx={{ ml: 0.5 }}
                                                    >
                                                        <BlockIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip
                                                    title={
                                                        isAdmin
                                                            ? "관리자 계정은 삭제할 수 없습니다"
                                                            : "삭제"
                                                    }
                                                >
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            disabled={isAdmin}
                                                            onClick={() =>
                                                                openDeleteDialog(
                                                                    member
                                                                )
                                                            }
                                                            sx={{ ml: 0.5 }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </Box>

                {/* Pagination */}
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

            {/* Detail Dialog */}
            <Dialog
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700, pb: 1.5 }}>
                    회원 상세 정보
                </DialogTitle>
                <DialogContent dividers sx={{ pt: 1, px: 0 }}>
                    {selectedMember ? (
                        <Box sx={{ px: 3 }}>
                            <DetailRow label="UID">
                                <Typography
                                    variant="body1"
                                    sx={{ fontFamily: "monospace" }}
                                >
                                    {selectedMember.uid}
                                </Typography>
                            </DetailRow>

                            <DetailRow label="이름">
                                <Typography variant="body1">
                                    {selectedMember.name}
                                </Typography>
                            </DetailRow>

                            <DetailRow label="권한">
                                <Typography variant="body1">
                                    {ROLE_LABEL[selectedMember.role] ||
                                        selectedMember.role}
                                </Typography>
                            </DetailRow>

                            <DetailRow label="이메일">
                                <Typography
                                    variant="body1"
                                    sx={{
                                        wordBreak: "break-all",
                                        color: "text.primary",
                                    }}
                                >
                                    {selectedMember.email}
                                </Typography>
                            </DetailRow>

                            <DetailRow label="전화번호">
                                <Typography
                                    variant="body1"
                                    sx={{ color: "text.primary" }}
                                >
                                    {selectedMember.phone || "-"}
                                </Typography>
                            </DetailRow>

                            <DetailRow label="생년월일">
                                <Typography
                                    variant="body1"
                                    sx={{ color: "text.primary" }}
                                >
                                    {selectedMember.birth || "-"}
                                </Typography>
                            </DetailRow>

                            <DetailRow label="상태" verticalAlign="flex-start">
                                <Chip
                                    size="small"
                                    label={
                                        selectedMember.status === "ACTIVE"
                                            ? "정상"
                                            : "정지"
                                    }
                                    color={
                                        STATUS_COLOR[selectedMember.status] ||
                                        "default"
                                    }
                                    icon={
                                        selectedMember.status === "ACTIVE" ? (
                                            <CheckCircleIcon
                                                sx={{ fontSize: 16 }}
                                            />
                                        ) : (
                                            <BlockIcon sx={{ fontSize: 16 }} />
                                        )
                                    }
                                    sx={{
                                        mt: 0.25,
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        px: 1,
                                    }}
                                />
                            </DetailRow>

                            <DetailRow label="가입일">
                                <Typography
                                    variant="body1"
                                    sx={{ whiteSpace: "nowrap" }}
                                >
                                    {selectedMember.joinedAt}
                                </Typography>
                            </DetailRow>
                        </Box>
                    ) : (
                        <Box sx={{ px: 3, py: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                선택된 회원이 없습니다.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions
                    sx={{ px: 2.5, py: 2, justifyContent: "space-between" }}
                >
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<BlockIcon fontSize="small" />}
                            onClick={() => {
                                if (!selectedMember) return;
                                handleToggleBlock(
                                    selectedMember.userId || selectedMember.uid,
                                    selectedMember.status
                                );
                            }}
                        >
                            {selectedMember?.status === "SUSPENDED"
                                ? "정지 해제"
                                : "계정 정지"}
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon fontSize="small" />}
                            disabled={selectedMember?.role === "ADMIN"}
                            onClick={() =>
                                selectedMember &&
                                openDeleteDialog(selectedMember)
                            }
                        >
                            삭제
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

            {/* Delete Dialog */}
            <Dialog
                open={deleteOpen}
                onClose={closeDeleteDialog}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700 }}>회원 삭제</DialogTitle>
                <DialogContent dividers>
                    {targetMember && (
                        <Stack spacing={2}>
                            <Typography variant="body2" color="text.secondary">
                                아래 입력란에 <b>{targetMember.uid}</b> 를
                                입력하면 삭제됩니다.
                            </Typography>
                            <TextField
                                size="small"
                                label="확인용 UID"
                                placeholder={targetMember.uid}
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                autoFocus
                            />
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog}>취소</Button>
                    <Button
                        variant="contained"
                        color="error"
                        disabled={
                            !targetMember ||
                            confirmText !== targetMember.uid ||
                            targetMember.role === "ADMIN"
                        }
                        onClick={handleConfirmDelete}
                    >
                        삭제하기
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Toast */}
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
