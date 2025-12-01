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
import {
    fetchUsers as apiFetchUsers,
    fetchUserDetail as apiFetchUserDetail,
    updateUser as apiUpdateUser,
    deleteUser as apiDeleteUser,
} from "../../api/admin/user";

const STATUS_COLOR = { ACTIVE: "success", SUSPENDED: "default" };
const STATUS_LABEL = { ACTIVE: "정상", SUSPENDED: "정지" };
const ROLE_LABEL = { USER: "일반회원", FACILITY: "시설회원" };

export default function MembersPage() {
    const [members, setMembers] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const [loading, setLoading] = useState(false);
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

    const initialFetchRef = useRef(false);
    const fetchingRef = useRef(false);

    const fetchUsers = async (p = page) => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;
        setLoading(true);

        try {
            const resp = await apiFetchUsers({
                page: p - 1,
                size: rowsPerPage,
                search: keyword.trim(),
                role: roleFilter === "ALL" ? undefined : roleFilter,
                status: statusFilter === "ALL" ? undefined : statusFilter,
            });

            const list = resp.content ?? [];

            const mapped = list.map((u) => ({
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
                roleId: u.roleId || (u.role && u.role.roleId),
                status: u.status || "ACTIVE",
                joinedAt: u.createdAt
                    ? new Date(u.createdAt).toLocaleString()
                    : "",
                raw: u,
            }));

            setMembers(mapped);
        } catch {
            setToast({
                open: true,
                message: "회원 목록 불러오기 실패",
                severity: "error",
            });
        } finally {
            fetchingRef.current = false;
            setLoading(false);
        }
    };

    const fetchUserDetail = async (userId) => {
        try {
            const u = await apiFetchUserDetail(userId);
            setSelectedMember({
                userId: u.userId,
                username: u.username,
                name: u.name,
                email: u.email,
                phone: u.phone,
                birth: u.birth || "-",
                role: u.roleCode || (u.role && u.role.roleCode),
                roleId: u.roleId,
                status: u.status || "ACTIVE",
                joinedAt: u.createdAt
                    ? new Date(u.createdAt).toLocaleString()
                    : "",
            });
            setDetailOpen(true);
        } catch {
            setToast({
                open: true,
                message: "회원 상세정보 불러오기 실패",
                severity: "error",
            });
        }
    };

    useEffect(() => {
        if (!initialFetchRef.current) {
            initialFetchRef.current = true;
            fetchUsers(1);
        }
    }, []);

    useEffect(() => {
        fetchUsers(page);
    }, [page, keyword, roleFilter, statusFilter]);

    const handleToggleBlock = async (userId, currentStatus) => {
        const newStatus =
            currentStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";

        try {
            const exist = await apiFetchUserDetail(userId);
            await apiUpdateUser(userId, {
                name: exist.name,
                email: exist.email,
                phone: exist.phone,
                roleId: exist.roleId,
                status: newStatus,
            });

            await fetchUsers(page);

            if (selectedMember?.userId === userId) {
                await fetchUserDetail(userId);
            }

            setToast({
                open: true,
                message: "상태 변경 완료",
                severity: "success",
            });
        } catch {
            setToast({
                open: true,
                message: "상태 변경 실패",
                severity: "error",
            });
        }
    };

    const openDeleteDialog = (m) => {
        setTargetMember(m);
        setConfirmText("");
        setDeleteOpen(true);
    };
    const closeDeleteDialog = () => setDeleteOpen(false);

    const handleConfirmDelete = async () => {
        if (!targetMember) return;

        try {
            await apiDeleteUser(targetMember.userId);
            await fetchUsers(page);

            if (selectedMember?.userId === targetMember.userId)
                setDetailOpen(false);

            setToast({
                open: true,
                message: "삭제 완료",
                severity: "success",
            });
        } catch {
            setToast({
                open: true,
                message: "삭제 실패",
                severity: "error",
            });
        } finally {
            closeDeleteDialog();
        }
    };

    const filteredList = useMemo(() => {
        const kw = keyword.trim().toLowerCase();

        return members.filter((m) => {
            const matchKeyword =
                kw === "" ||
                m.name?.toLowerCase().includes(kw) ||
                m.email?.toLowerCase().includes(kw) ||
                String(m.userId).includes(kw);

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

    const pageCount = Math.max(1, Math.ceil(filteredList.length / rowsPerPage));

    useEffect(() => setPage(1), [keyword, roleFilter, statusFilter]);

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

    return (
        <>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
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
                        sx={{ textAlign: "center" }}
                    >
                        가입된 사용자 목록을 확인하고 관리할 수 있습니다.
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

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
                    {/* left */}
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
                            label="권한"
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
                            <MenuItem value="USER">일반회원</MenuItem>
                            <MenuItem value="FACILITY">시설회원</MenuItem>
                        </TextField>

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
                            <MenuItem value="ACTIVE">정상</MenuItem>
                            <MenuItem value="SUSPENDED">정지</MenuItem>
                        </TextField>

                        <TextField
                            size="small"
                            placeholder="이름 / 이메일 / userId 검색"
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

                    {/* right summary */}
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ textAlign: "right", mr: 1 }}>
                            <Typography
                                sx={{
                                    fontSize: "0.8rem",
                                    color: "text.secondary",
                                }}
                            >
                                총 {filteredList.length}명
                            </Typography>
                            <Typography
                                sx={{ fontSize: "0.8rem", fontWeight: 600 }}
                            >
                                페이지 {page} / {pageCount}
                            </Typography>
                        </Box>

                        <Tooltip title="새로고침">
                            <IconButton
                                size="small"
                                onClick={() => fetchUsers(1)}
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
                {/* ----------------------------------------------------- */}

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
                                        fontWeight: 600,
                                        whiteSpace: "nowrap",
                                        fontSize: "0.8rem",
                                        color: "text.primary",
                                    },
                                }}
                            >
                                <TableCell>User ID</TableCell>
                                <TableCell>이름</TableCell>
                                <TableCell>이메일</TableCell>
                                <TableCell>권한</TableCell>
                                <TableCell>상태</TableCell>
                                <TableCell>가입일</TableCell>
                                <TableCell align="right">액션</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {pagedList.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        align="center"
                                        sx={{ py: 6 }}
                                    >
                                        {loading
                                            ? "불러오는 중..."
                                            : "조건에 맞는 회원이 없습니다."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pagedList.map((m) => {
                                    const disabled = m.status === "SUSPENDED";
                                    return (
                                        <TableRow
                                            key={m.userId}
                                            hover
                                            sx={{
                                                backgroundColor: disabled
                                                    ? "rgba(0,0,0,0.04)"
                                                    : "transparent",
                                                color: disabled
                                                    ? "text.disabled"
                                                    : "inherit",
                                            }}
                                        >
                                            <TableCell>{m.userId}</TableCell>
                                            <TableCell>{m.name}</TableCell>
                                            <TableCell>{m.email}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={
                                                        ROLE_LABEL[m.role] ||
                                                        m.role
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label={
                                                        STATUS_LABEL[m.status]
                                                    }
                                                    color={
                                                        STATUS_COLOR[m.status]
                                                    }
                                                    icon={
                                                        m.status ===
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
                                                />
                                            </TableCell>

                                            <TableCell>{m.joinedAt}</TableCell>

                                            <TableCell align="right">
                                                <Tooltip title="상세 보기">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            fetchUserDetail(
                                                                m.userId
                                                            )
                                                        }
                                                        sx={{
                                                            color: disabled
                                                                ? "text.disabled"
                                                                : "",
                                                        }}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip
                                                    title={
                                                        m.status === "SUSPENDED"
                                                            ? "정지 해제"
                                                            : "계정 정지"
                                                    }
                                                >
                                                    <IconButton
                                                        size="small"
                                                        color={
                                                            m.status ===
                                                            "SUSPENDED"
                                                                ? "success"
                                                                : "error"
                                                        }
                                                        onClick={() =>
                                                            handleToggleBlock(
                                                                m.userId,
                                                                m.status
                                                            )
                                                        }
                                                        sx={{ ml: 0.5 }}
                                                    >
                                                        <BlockIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="삭제">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() =>
                                                            openDeleteDialog(m)
                                                        }
                                                        sx={{ ml: 0.5 }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </Box>

                <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(_, v) => setPage(v)}
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
                <DialogTitle sx={{ fontWeight: 700 }}>
                    회원 상세 정보
                </DialogTitle>
                <DialogContent dividers>
                    {selectedMember && (
                        <Stack sx={{ px: 1 }}>
                            <DetailRow
                                label="User ID"
                                value={selectedMember.userId}
                            />
                            <DetailRow
                                label="이름"
                                value={selectedMember.name}
                            />
                            <DetailRow
                                label="권한"
                                value={
                                    ROLE_LABEL[selectedMember.role] ||
                                    selectedMember.role
                                }
                            />
                            <DetailRow
                                label="이메일"
                                value={selectedMember.email}
                            />
                            <DetailRow
                                label="전화"
                                value={selectedMember.phone}
                            />
                            <DetailRow
                                label="생년월일"
                                value={selectedMember.birth}
                            />
                            <DetailRow
                                label="상태"
                                value={
                                    <Chip
                                        size="small"
                                        label={
                                            STATUS_LABEL[selectedMember.status]
                                        }
                                        color={
                                            STATUS_COLOR[selectedMember.status]
                                        }
                                    />
                                }
                            />
                            <DetailRow
                                label="가입일"
                                value={selectedMember.joinedAt}
                            />
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<BlockIcon fontSize="small" />}
                        onClick={() =>
                            handleToggleBlock(
                                selectedMember.userId,
                                selectedMember.status
                            )
                        }
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
                        onClick={() => openDeleteDialog(selectedMember)}
                    >
                        삭제
                    </Button>

                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => setDetailOpen(false)}
                    >
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteOpen} onClose={closeDeleteDialog}>
                <DialogTitle sx={{ fontWeight: 700 }}>회원 삭제</DialogTitle>
                <DialogContent dividers>
                    {targetMember && (
                        <Stack spacing={2}>
                            <Typography variant="body2" color="text.secondary">
                                아래 입력란에 <b>{targetMember.userId}</b> 를
                                입력하면 삭제됩니다.
                            </Typography>
                            <TextField
                                size="small"
                                label="User ID 확인"
                                placeholder={targetMember.userId}
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
                            confirmText !== String(targetMember.userId)
                        }
                        onClick={handleConfirmDelete}
                    >
                        삭제하기
                    </Button>
                </DialogActions>
            </Dialog>

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
