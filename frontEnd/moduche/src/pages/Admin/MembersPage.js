// src/pages/Admin/MembersPage.js
import React, { useMemo, useState, useEffect } from "react";
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
    TableContainer,
    TableHead,
    TableRow,
    Pagination,
    Typography,
    InputAdornment,
    Divider,
    Button,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";

import Paper from "../../component/common/Paper";

const DUMMY_MEMBERS = [
    {
        uid: "U0001",
        name: "김민수",
        email: "minsu@example.com",
        role: "USER",
        status: "ACTIVE",
        joinedAt: "2025-09-12 14:32",
    },
    {
        uid: "U0002",
        name: "관리자계정",
        email: "admin@example.com",
        role: "ADMIN",
        status: "ACTIVE",
        joinedAt: "2025-07-03 09:10",
    },
    {
        uid: "U0003",
        name: "테스트유저",
        email: "test4@example.com",
        role: "USER",
        status: "ACTIVE",
        joinedAt: "2025-10-20 11:22",
    },
    {
        uid: "U0004",
        name: "블랙리스트",
        email: "banme@example.com",
        role: "USER",
        status: "SUSPENDED",
        joinedAt: "2025-06-18 07:55",
    },
];

const STATUS_COLOR = {
    ACTIVE: "success",
    SUSPENDED: "error",
};

const ROLE_LABEL = {
    USER: "일반",
    ADMIN: "관리자",
};

export default function MembersPage() {
    // 상태값들
    const [members, setMembers] = useState(DUMMY_MEMBERS);
    const [keyword, setKeyword] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    // 액션들
    const handleRefresh = () => {
        console.log("🔄 refresh member list (call API)");
    };

    const handleExport = () => {
        console.log("⬇ export member list");
    };

    const handleView = (uid) => {
        console.log("👁 view detail:", uid);
    };

    const handleToggleBlock = (uid, currentStatus) => {
        if (currentStatus === "SUSPENDED") {
            console.log(`✅ 해제 요청 for ${uid}`);
        } else {
            console.log(`⛔ 정지 요청 for ${uid}`);
        }
    };

    // 필터 적용된 리스트
    const filteredList = useMemo(() => {
        const kw = keyword.trim().toLowerCase();

        return members.filter((m) => {
            const matchKeyword =
                kw === "" ||
                m.name.toLowerCase().includes(kw) ||
                m.email.toLowerCase().includes(kw) ||
                m.uid.toLowerCase().includes(kw);

            const matchRole =
                roleFilter === "ALL" ? true : m.role === roleFilter;

            const matchStatus =
                statusFilter === "ALL" ? true : m.status === statusFilter;

            return matchKeyword && matchRole && matchStatus;
        });
    }, [members, keyword, roleFilter, statusFilter]);

    // 현재 페이지 slice
    const pagedList = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredList.slice(start, start + rowsPerPage);
    }, [filteredList, page]);

    const pageCount = Math.ceil(filteredList.length / rowsPerPage) || 1;

    useEffect(() => {
        setPage(1);
    }, [keyword, roleFilter, statusFilter, members]);

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
            {/* 상단 영역: 메인 타이틀/설명 */}
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

            {/* 검색/필터/액션바 (관리자 계정 페이지와 동일한 스타일) */}
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
                {/* 왼쪽: 검색 + 필터 묶음 */}
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
                        size="small"
                        label="권한"
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
                        <MenuItem value="USER">일반</MenuItem>
                        <MenuItem value="ADMIN">관리자</MenuItem>
                    </TextField>

                    {/* 상태 필터 */}
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
                        <MenuItem value="ACTIVE">정상</MenuItem>
                        <MenuItem value="SUSPENDED">정지</MenuItem>
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

                {/* 오른쪽: 현황 + 버튼 묶음 */}
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
                    {/* "총 N명 · 페이지 X / Y" 부분 */}
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

            {/* 테이블 */}
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
                                    sx={{ py: 6, color: "text.secondary" }}
                                >
                                    조건에 맞는 회원이 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pagedList.map((member) => (
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
                                    {/* UID */}
                                    <TableCell
                                        sx={{
                                            fontFamily: "monospace",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {member.uid}
                                    </TableCell>

                                    {/* 이름 */}
                                    <TableCell
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {member.name}
                                    </TableCell>

                                    {/* 이메일 */}
                                    <TableCell
                                        sx={{
                                            maxWidth: 200,
                                            fontSize: "0.8rem",
                                            color: "text.secondary",
                                        }}
                                    >
                                        {member.email}
                                    </TableCell>

                                    {/* 권한 */}
                                    <TableCell>
                                        <Chip
                                            label={
                                                ROLE_LABEL[member.role] ||
                                                member.role
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

                                    {/* 상태 */}
                                    <TableCell>
                                        <Chip
                                            label={
                                                member.status === "ACTIVE"
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
                                                member.status === "ACTIVE" ? (
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

                                    {/* 가입일 */}
                                    <TableCell
                                        sx={{
                                            fontSize: "0.8rem",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {member.joinedAt}
                                    </TableCell>

                                    {/* 액션 */}
                                    <TableCell align="right">
                                        <Tooltip title="상세 보기">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleView(member.uid)
                                                }
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip
                                            title={
                                                member.status === "SUSPENDED"
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
                                                        member.uid,
                                                        member.status
                                                    )
                                                }
                                            >
                                                <BlockIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

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
        </Paper>
    );
}
