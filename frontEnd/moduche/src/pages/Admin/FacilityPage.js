// src/pages/Admin/FacilityPage.js
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
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from "@mui/icons-material/AddBusiness";

import axios from "axios";
import { API_SERVER_HOST, AUTH } from "../../component/common/Variables";
import Paper from "../../component/common/Paper";

// ----------------------
// axios 인스턴스 + JWT
// ----------------------
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

const FACILITIES_ENDPOINT = "/api/facilities";

// 라벨 매핑
const FACILITY_TYPE_LABEL = {
    REHAB_CENTER: "재활 센터",
    AQUA_THERAPY: "수중 재활",
    SPORTS_GYM: "장애인 체육관",
};

const STATUS_LABEL = {
    ACTIVE: "운영 중",
    RECRUITING: "신규 모집 중",
    PAUSED: "일시 중단",
};

const STATUS_COLOR = {
    ACTIVE: "success",
    RECRUITING: "warning",
    PAUSED: "default",
};

function FacilityPage() {
    const [list, setList] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");

    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const [detailOpen, setDetailOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    // ----------------------
    // API: 시설 목록 조회
    // ----------------------
    const fetchFacilities = async () => {
        try {
            const resp = await http.get(FACILITIES_ENDPOINT);
            const data = resp.data;
            const facilities = data?.content ?? data ?? [];
            setList(Array.isArray(facilities) ? facilities : []);
        } catch (e) {
            console.error("시설 목록 로드 실패", e);
        }
    };

    useEffect(() => {
        fetchFacilities();
    }, []);

    const handleRefresh = () => fetchFacilities();

    const handleExport = () => {
        console.log("⬇ 시설 목록 다운로드 (엑셀/CSV 예정)");
    };

    const handleCreateFacility = () => {
        const w = 520;
        const h = 640;

        const dualScreenLeft = window.screenLeft ?? window.screenX ?? 0;
        const dualScreenTop = window.screenTop ?? window.screenY ?? 0;

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

        const availW = window.screen?.availWidth ?? viewportW;
        const systemZoom = viewportW / (availW || 1);

        const left = (viewportW - w) / 2 / systemZoom + dualScreenLeft;
        const top = (viewportH - h) / 2 / systemZoom + dualScreenTop;

        window.open(
            "/admin-window/facilities/new",
            "FacilityCreateWindow",
            `scrollbars=yes,width=${w},height=${h},top=${top},left=${left},noopener,noreferrer`
        );
    };

    const handleView = (facilityId) => {
        const found = list.find(
            (f) => String(f.facilityId) === String(facilityId)
        );
        if (!found) return;
        setSelected(found);
        setDetailOpen(true);
    };

    useEffect(() => {
        const onMessage = (event) => {
            if (event.origin !== window.location.origin) return;

            const { type, payload } = event.data || {};
            if (type === "FACILITY_CREATED" && payload) {
                setList((prev) => {
                    const exists = prev.some(
                        (f) =>
                            String(f.facilityId) === String(payload.facilityId)
                    );
                    return exists ? prev : [payload, ...prev];
                });
            }
        };

        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, []);

    // 필터링
    const filteredList = useMemo(() => {
        const kw = keyword.trim().toLowerCase();

        return list.filter((row) => {
            const name = row.facilityName || "";
            const addr = row.facilityAddress || "";
            const idStr = row.facilityId != null ? String(row.facilityId) : "";

            const matchKeyword =
                kw === "" ||
                name.toLowerCase().includes(kw) ||
                addr.toLowerCase().includes(kw) ||
                idStr.includes(kw);

            const matchStatus =
                statusFilter === "ALL" ? true : row.status === statusFilter;

            const matchType =
                typeFilter === "ALL" ? true : row.facilityType === typeFilter;

            return matchKeyword && matchStatus && matchType;
        });
    }, [list, keyword, statusFilter, typeFilter]);

    const pagedList = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredList.slice(start, start + rowsPerPage);
    }, [filteredList, page]);

    const pageCount = Math.ceil(filteredList.length / rowsPerPage) || 1;

    useEffect(() => {
        setPage(1);
    }, [keyword, statusFilter, typeFilter, list]);

    const activeCount = filteredList.filter(
        (f) => f.status === "ACTIVE"
    ).length;
    const recruitingCount = filteredList.filter(
        (f) => f.status === "RECRUITING"
    ).length;

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
                    wordBreak: "break-all",
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
                            textAlign: { xs: "left", sm: "center" },
                            color: "primary.main",
                        }}
                    >
                        시설 관리
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: { xs: "left", sm: "center" } }}
                    >
                        DB facility 테이블 기준으로 시설 정보를 조회·관리합니다.
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* 옵션 영역 */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "space-between",
                        rowGap: 2,
                        columnGap: 2,
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    {/* 필터 영역 */}
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            rowGap: 1.5,
                            columnGap: 1.5,
                        }}
                    >
                        <TextField
                            select
                            size="small"
                            label="상태"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            sx={{ minWidth: 130 }}
                        >
                            <MenuItem value="ALL">전체</MenuItem>
                            <MenuItem value="ACTIVE">운영 중</MenuItem>
                            <MenuItem value="RECRUITING">신규 모집 중</MenuItem>
                            <MenuItem value="PAUSED">일시 중단</MenuItem>
                        </TextField>

                        <TextField
                            select
                            size="small"
                            label="시설 타입"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="ALL">전체</MenuItem>
                            <MenuItem value="REHAB_CENTER">재활 센터</MenuItem>
                            <MenuItem value="AQUA_THERAPY">수중 재활</MenuItem>
                            <MenuItem value="SPORTS_GYM">
                                장애인 체육관
                            </MenuItem>
                        </TextField>

                        <TextField
                            size="small"
                            placeholder="시설명 / 시설ID / 주소 검색"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            sx={{ minWidth: { xs: "100%", md: 260 } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon
                                            sx={{ color: "text.disabled" }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* 오른쪽 버튼/통계 */}
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        flexWrap="wrap"
                    >
                        <Box sx={{ textAlign: "right" }}>
                            <Typography
                                sx={{
                                    fontSize: "0.8rem",
                                    color: "text.secondary",
                                }}
                            >
                                총 {filteredList.length}곳
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                }}
                            >
                                운영 중 {activeCount}곳 · 모집 중{" "}
                                {recruitingCount}곳
                            </Typography>
                        </Box>

                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleCreateFacility}
                            sx={{ textTransform: "none" }}
                        >
                            새 시설 등록
                        </Button>

                        <Tooltip title="새로고침">
                            <IconButton size="small" onClick={handleRefresh}>
                                <RefreshIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="내보내기">
                            <IconButton size="small" onClick={handleExport}>
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
                        maxHeight: 480,
                        overflow: "auto",
                    }}
                >
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>시설ID</TableCell>
                                <TableCell>시설명</TableCell>
                                <TableCell>시설 타입</TableCell>
                                <TableCell>주소</TableCell>
                                <TableCell>운영 시간</TableCell>
                                {/* 접근성 정보 제거됨 */}
                                <TableCell>상태</TableCell>
                                <TableCell align="right">액션</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {pagedList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        조건에 맞는 시설이 없습니다.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pagedList.map((row) => (
                                    <TableRow
                                        key={row.facilityId}
                                        hover
                                        sx={{
                                            "&:hover": {
                                                backgroundColor:
                                                    "rgba(0,0,0,0.03)",
                                            },
                                        }}
                                    >
                                        <TableCell
                                            sx={{
                                                fontFamily: "monospace",
                                            }}
                                        >
                                            {row.facilityId}
                                        </TableCell>
                                        <TableCell>
                                            {row.facilityName}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={
                                                    FACILITY_TYPE_LABEL[
                                                        row.facilityType
                                                    ] || row.facilityType
                                                }
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {row.facilityAddress}
                                        </TableCell>
                                        <TableCell>{row.openHours}</TableCell>

                                        {/* 접근성 정보 제거됨 */}

                                        <TableCell>
                                            <Chip
                                                label={
                                                    STATUS_LABEL[row.status] ||
                                                    row.status
                                                }
                                                size="small"
                                                color={STATUS_COLOR[row.status]}
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            <Tooltip title="상세 보기">
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        handleView(
                                                            row.facilityId
                                                        )
                                                    }
                                                >
                                                    <VisibilityIcon fontSize="small" />
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
                        onChange={(_, v) => setPage(v)}
                        color="primary"
                        size="small"
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
                <DialogTitle sx={{ fontWeight: 700 }}>
                    시설 상세 정보
                </DialogTitle>
                <DialogContent dividers sx={{ px: 3 }}>
                    {selected ? (
                        <Box sx={{ pt: 1 }}>
                            <DetailRow
                                label="시설ID"
                                value={selected.facilityId}
                            />
                            <DetailRow
                                label="시설명"
                                value={selected.facilityName}
                            />
                            <DetailRow
                                label="시설 타입"
                                value={
                                    FACILITY_TYPE_LABEL[
                                        selected.facilityType
                                    ] || selected.facilityType
                                }
                            />
                            <DetailRow
                                label="주소"
                                value={selected.facilityAddress}
                            />
                            <DetailRow
                                label="연락처"
                                value={selected.facilityPhone}
                            />
                            <DetailRow
                                label="운영 시간"
                                value={selected.openHours}
                            />
                            <DetailRow
                                label="접근성"
                                value={selected.accessibilityFeatures}
                            />
                            <DetailRow
                                label="위도"
                                value={
                                    selected.geoLat != null
                                        ? String(selected.geoLat)
                                        : "-"
                                }
                            />
                            <DetailRow
                                label="경도"
                                value={
                                    selected.geoLng != null
                                        ? String(selected.geoLng)
                                        : "-"
                                }
                            />
                            <DetailRow
                                label="상태"
                                value={
                                    STATUS_LABEL[selected.status] ||
                                    selected.status
                                }
                            />
                        </Box>
                    ) : (
                        <Typography sx={{ py: 2 }}>
                            선택된 시설이 없습니다.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 1.5 }}>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => setDetailOpen(false)}
                    >
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default FacilityPage;
