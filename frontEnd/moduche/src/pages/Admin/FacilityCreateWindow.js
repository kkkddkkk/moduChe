import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Paper,
    Stack,
    Button,
    Snackbar,
    Alert,
    Fade,
    TextField,
    MenuItem,
    InputAdornment,
} from "@mui/material";

import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AccessibleForwardOutlinedIcon from "@mui/icons-material/AccessibleForward";

import {
    StartTitle,
    SmallerSubTitle,
    Contents100,
} from "../../component/common/Text";

export default function FacilityCreateWindow() {
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [category, setCategory] = useState("REHAB_CENTER");
    const [accessibility, setAccessibility] = useState("");
    const [status, setStatus] = useState("ACTIVE");

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    // 필수값 체크
    const disabled = useMemo(
        () => !name.trim() || !city.trim() || !category,
        [name, city, category]
    );

    const generateFid = () =>
        "FAC-" + String(Math.floor(Math.random() * 10_000)).padStart(4, "0");

    const nowStr = () => {
        const n = new Date();
        const pad = (x) => String(x).padStart(2, "0");
        return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(
            n.getDate()
        )} ${pad(n.getHours())}:${pad(n.getMinutes())}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (disabled) return;

        const payload = {
            fid: generateFid(),
            name: name.trim(),
            city: city.trim(),
            category,
            accessibility: accessibility.trim(),
            status,
            createdAt: nowStr(),
        };

        try {
            window.opener?.postMessage(
                { type: "FACILITY_CREATED", payload },
                window.origin
            );
            setToast({
                open: true,
                message: "시설이 등록되었습니다.",
                severity: "success",
            });
            setTimeout(() => window.close(), 700);
        } catch (err) {
            console.error("postMessage 실패:", err);
            setToast({
                open: true,
                message: "데이터 전송 실패",
                severity: "error",
            });
        }
    };

    // ESC 닫기 + 팝업 크기 고정
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && window.close();
        window.addEventListener("keydown", onKey);
        try {
            window.resizeTo(520, 640);
        } catch {}
        document.title = "새 시설 등록";
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                bgcolor: (t) =>
                    t.palette.mode === "dark"
                        ? t.palette.background.default
                        : "#fafafa",
                p: 2,
            }}
        >
            <Paper
                elevation={4}
                sx={{ width: 520, maxWidth: "100%", borderRadius: 3, p: 3 }}
            >
                <Stack spacing={2}>
                    <StartTitle
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                        <AddBusinessIcon fontSize="small" /> 새 시설 등록
                    </StartTitle>

                    <SmallerSubTitle>
                        장애인 맞춤 운동/재활 프로그램을 제공하는 시설 정보를
                        등록합니다.
                    </SmallerSubTitle>

                    {/* 시설명 */}
                    <Contents100 bold>시설명</Contents100>
                    <TextField
                        size="small"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="예: 한빛 재활 스포츠센터"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ pl: 1 }}>
                                    <BusinessOutlinedIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* 지역 */}
                    <Contents100 bold>지역</Contents100>
                    <TextField
                        size="small"
                        fullWidth
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="예: 서울 강서구"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ pl: 1 }}>
                                    <LocationOnOutlinedIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* 시설 유형 */}
                    <Contents100 bold>시설 타입</Contents100>
                    <TextField
                        select
                        size="small"
                        fullWidth
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <MenuItem value="REHAB_CENTER">재활 센터</MenuItem>
                        <MenuItem value="AQUA_THERAPY">수중 재활</MenuItem>
                        <MenuItem value="SPORTS_GYM">장애인 체육관</MenuItem>
                        <MenuItem value="COMMUNITY_SPACE">
                            커뮤니티 공간
                        </MenuItem>
                    </TextField>

                    {/* 접근성 정보 */}
                    <Contents100 bold>접근성 정보</Contents100>
                    <TextField
                        size="small"
                        fullWidth
                        value={accessibility}
                        onChange={(e) => setAccessibility(e.target.value)}
                        placeholder="예: 휠체어 가능, 엘리베이터, 리프트 지원 등"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ pl: 1 }}>
                                    <AccessibleForwardOutlinedIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* 상태 */}
                    <Contents100 bold>상태</Contents100>
                    <TextField
                        select
                        size="small"
                        fullWidth
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ pl: 1 }}>
                                    <AccessTimeOutlinedIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    >
                        <MenuItem value="ACTIVE">운영 중</MenuItem>
                        <MenuItem value="RECRUITING">신규 모집 중</MenuItem>
                        <MenuItem value="PAUSED">일시 중단</MenuItem>
                    </TextField>

                    {/* 버튼 */}
                    <Stack
                        direction="row"
                        spacing={1.5}
                        justifyContent="flex-end"
                        sx={{ pt: 1 }}
                    >
                        <Button variant="text" onClick={() => window.close()}>
                            취소
                        </Button>
                        <Button
                            variant="contained"
                            disabled={disabled}
                            onClick={handleSubmit}
                        >
                            등록
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            {/* 토스트 */}
            <Snackbar
                open={toast.open}
                autoHideDuration={2000}
                onClose={() => setToast((t) => ({ ...t, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Fade in>
                    <Alert severity={toast.severity} variant="filled">
                        {toast.message}
                    </Alert>
                </Fade>
            </Snackbar>
        </Box>
    );
}
