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
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Pagination,
    InputAdornment,
    Button,
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

const DUMMY_ADMINS = [
    {
        uid: "A0001",
        name: "최관리",
        email: "superadmin@example.com",
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        createdAt: "2025-07-01 10:12",
    },
    {
        uid: "A0002",
        name: "운영담당",
        email: "ops@example.com",
        role: "OPERATOR",
        status: "ACTIVE",
        createdAt: "2025-09-14 08:40",
    },
    {
        uid: "A0003",
        name: "고객지원",
        email: "support@example.com",
        role: "CS_MANAGER",
        status: "DISABLED",
        createdAt: "2025-10-02 12:21",
    },
];

const ROLE_LABEL = {
    SUPER_ADMIN: "최고관리자",
    OPERATOR: "운영",
    CS_MANAGER: "고객지원",
};

const STATUS_LABEL = {
    ACTIVE: "사용 중",
    DISABLED: "중지",
};

const STATUS_COLOR = {
    ACTIVE: "success",
    DISABLED: "default",
};

export default function AdministratorPage() {
    // 상태값들
    const [admins, setAdmins] = useState(DUMMY_ADMINS);
    const [keyword, setKeyword] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    // 액션 핸들러들
    const handleCreateAdmin = () => {
        console.log("👤 새 관리자 추가 모달 오픈");
    };

    const handleRefresh = () => {
        console.log("🔄 관리자 계정 리스트 새로고침 (API)");
    };

    const handleExport = () => {
        console.log("⬇ 관리자 계정 목록 내보내기");
    };

    const handleView = (uid) => {
        console.log("👁 상세 보기:", uid);
    };

    const handleToggleEnabled = (uid, currentStatus) => {
        if (currentStatus === "DISABLED") {
            console.log(`✅ ${uid} 활성화 요청`);
        } else {
            console.log(`⛔ ${uid} 비활성화 요청`);
        }
    };

    const handleDelete = (uid) => {
        console.log(`❌ ${uid} 완전 삭제 요청`);
    };

    // 필터링
    const filteredList = useMemo(() => {
        const kw = keyword.trim().toLowerCase();

        return admins.filter((a) => {
            const matchKeyword =
                kw === "" ||
                a.name.toLowerCase().includes(kw) ||
                a.email.toLowerCase().includes(kw) ||
                a.uid.toLowerCase().includes(kw);

            const matchRole =
                roleFilter === "ALL" ? true : a.role === roleFilter;

            const matchStatus =
                statusFilter === "ALL" ? true : a.status === statusFilter;

            return matchKeyword && matchRole && matchStatus;
        });
    }, [admins, keyword, roleFilter, statusFilter]);

    // 현재 페이지 slice
    const pagedList = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredList.slice(start, start + rowsPerPage);
    }, [filteredList, page]);

    const pageCount = Math.ceil(filteredList.length / rowsPerPage) || 1;

    // 필터 변경 시 페이지 리셋
    useEffect(() => {
        setPage(1);
    }, [keyword, roleFilter, statusFilter, admins]);

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
            {/* 1. 상단 영역: 타이틀 / 설명 */}
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
                    관리자 계정을 생성하고 권한을 부여하거나 비활성화할 수 있습니다.
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* 2. 필터 / 검색 / 오른쪽 액션 바 */}
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
                {/* 왼쪽: 필터 + 검색 */}
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
                    {/* 권한 필터 */}
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
                                "& fieldset": {
                                    borderColor: "divider",
                                },
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
                        <MenuItem value="SUPER_ADMIN">최고관리자</MenuItem>
                        <MenuItem value="OPERATOR">운영</MenuItem>
                        <MenuItem value="CS_MANAGER">고객지원</MenuItem>
                    </TextField>

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
                                "& fieldset": {
                                    borderColor: "divider",
                                },
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
                        <MenuItem value="ACTIVE">사용 중</MenuItem>
                        <MenuItem value="DISABLED">중지</MenuItem>
                    </TextField>

                    {/* 검색창 */}
                    <TextField
                        size="small"
                        placeholder="이름 / 이메일 / UID 검색"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        sx={{
                            minWidth: { xs: "100%", md: 240 },
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

                {/* 오른쪽: 현황 + 버튼들 */}
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
                    {/* 인원/페이지 표시 */}
                    <Typography
                        sx={{
                            fontSize: "0.8rem",
                            color: "text.secondary",
                            fontWeight: 400,
                            whiteSpace: "nowrap",
                        }}
                    >
                        총 {filteredList.length}명 · 페이지 {page} / {pageCount}
                    </Typography>

                    {/* 새 관리자 추가 버튼 */}
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
                        onClick={handleCreateAdmin}
                    >
                        새 관리자 추가
                    </Button>

                    {/* 새로고침 / 내보내기 묶음 */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            overflow: "hidden",
                        }}
                    >
                        <Tooltip title="새로고침">
                            <IconButton
                                size="small"
                                onClick={handleRefresh}
                                sx={{
                                    borderRadius: 0,
                                    "&:hover": {
                                        bgcolor: "primary.main",
                                        color: "#fff",
                                    },
                                }}
                            >
                                <RefreshIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Divider orientation="vertical" flexItem />

                        <Tooltip title="내보내기">
                            <IconButton
                                size="small"
                                onClick={handleExport}
                                sx={{
                                    borderRadius: 0,
                                    "&:hover": {
                                        bgcolor: "success.main",
                                        color: "#fff",
                                    },
                                }}
                            >
                                <DownloadIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Stack>
            </Box>

            {/* 3. 테이블 */}
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: 0,
                    maxHeight: 480,
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
                            <TableCell>UID</TableCell>
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
                                    조건에 맞는 관리자가 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pagedList.map((admin) => (
                                <TableRow
                                    key={admin.uid}
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
                                    {/* UID */}
                                    <TableCell
                                        sx={{
                                            fontFamily: "monospace",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {admin.uid}
                                    </TableCell>

                                    {/* 이름 */}
                                    <TableCell
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {admin.name}
                                    </TableCell>

                                    {/* 이메일 */}
                                    <TableCell
                                        sx={{
                                            maxWidth: 220,
                                            fontSize: "0.8rem",
                                            color: "text.secondary",
                                        }}
                                    >
                                        {admin.email}
                                    </TableCell>

                                    {/* 역할 */}
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

                                    {/* 상태 */}
                                    <TableCell>
                                        <Chip
                                            label={
                                                STATUS_LABEL[admin.status]
                                            }
                                            size="small"
                                            color={
                                                STATUS_COLOR[admin.status]
                                            }
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

                                    {/* 생성일 */}
                                    <TableCell
                                        sx={{
                                            fontSize: "0.8rem",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {admin.createdAt}
                                    </TableCell>

                                    {/* 액션 */}
                                    <TableCell align="right">
                                        <Tooltip title="상세 보기">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleView(admin.uid)
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
                                                    admin.status ===
                                                    "DISABLED"
                                                        ? "success"
                                                        : "warning"
                                                }
                                                onClick={() =>
                                                    handleToggleEnabled(
                                                        admin.uid,
                                                        admin.status
                                                    )
                                                }
                                            >
                                                <BlockIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="완전 삭제">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() =>
                                                    handleDelete(admin.uid)
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
            </TableContainer>

            {/* 4. 페이지네이션 */}
            <Stack
                direction="row"
                justifyContent="center"
                sx={{ mt: 2 }}
            >
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
    );
}
