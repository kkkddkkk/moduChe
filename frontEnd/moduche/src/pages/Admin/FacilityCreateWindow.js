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
    InputAdornment,
} from "@mui/material";

import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import AccessibleForwardOutlinedIcon from "@mui/icons-material/AccessibleForward";

import api from "../../api/axiosInstance";

import {
    StartTitle,
    SmallerSubTitle,
    Contents100,
} from "../../component/common/Text";

const http = api;

// ------------------------------------
// SearchMap (주소 검색 + 버튼 정렬 개선)
// ------------------------------------
function SearchMap({ loca, setLoca, setLat, setLng }) {
    const [isLoaded, setIsLoaded] = useState(false);

    // 다음 주소 API 로드
    useEffect(() => {
        if (window.daum && window.daum.Postcode) {
            setIsLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src =
            "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.onload = () => setIsLoaded(true);
        script.onerror = () => console.error("Daum 주소 API 로드 실패");
        document.body.appendChild(script);
    }, []);

    const handleSearchLoca = () => {
        if (!isLoaded) {
            alert("주소 API 로딩 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        new window.daum.Postcode({
            oncomplete(data) {
                const address =
                    data.userSelectedType === "R"
                        ? data.roadAddress
                        : data.jibunAddress;

                setLoca(address);
                getCoords(address);
            },
        }).open();
    };

    const getCoords = async (address) => {
        try {
            const res = await fetch(
                `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
                    address
                )}`,
                {
                    headers: {
                        Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
                    },
                }
            );

            const data = await res.json();
            if (data?.documents?.length > 0) {
                setLat(data.documents[0].y);
                setLng(data.documents[0].x);
            }
        } catch (err) {
            console.error("좌표 변환 오류:", err);
        }
    };

    return (
        <Box sx={{ width: "100%", display: "flex", gap: 1 }}>
            {/* 주소 입력 */}
            <TextField
                fullWidth
                size="medium"
                value={loca}
                placeholder="주소 검색 후 자동 입력"
                InputProps={{
                    readOnly: true,
                    sx: { height: 48 },
                    startAdornment: (
                        <InputAdornment position="start">
                            <LocationOnOutlinedIcon fontSize="small" />
                        </InputAdornment>
                    ),
                }}
            />

            {/* 검색 버튼 */}
            <Button
                variant="contained"
                onClick={handleSearchLoca}
                sx={{
                    height: 48,
                    fontWeight: "bold",
                    px: 2,
                    whiteSpace: "nowrap",
                }}
            >
                검색
            </Button>
        </Box>
    );
}

export default function FacilityCreateWindow() {
    const [name, setName] = useState("");
    const [city, setCity] = useState(""); // 주소
    const [detailAddr, setDetailAddr] = useState(""); // 상세주소
    const [category, setCategory] = useState("");
    const [accessibility, setAccessibility] = useState("");

    const [openHours, setOpenHours] = useState("");

    const [geoLat, setGeoLat] = useState(null);
    const [geoLng, setGeoLng] = useState(null);

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const disabled = useMemo(
        () =>
            !name.trim() ||
            !city.trim() ||
            !category.trim(),
        [name, city, category]
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (disabled) return;

        const fullAddress =
            detailAddr.trim() ? `${city} ${detailAddr}` : city;

        const body = {
            facilityName: name.trim(),
            facilityAddress: fullAddress,
            facilityType: category.trim(),
            accessibilityFeatures: accessibility.trim(),
            status: "ACTIVE",

            facilityPhone: "",
            openHours: openHours.trim(),
            geoLat,
            geoLng,
        };

        try {
            const { data } = await http.post("/facilities", body);

            window.opener?.postMessage(
                { type: "FACILITY_CREATED", payload: data },
                window.location.origin
            );

            setToast({
                open: true,
                message: "시설이 등록되었습니다.",
                severity: "success",
            });

            setTimeout(() => window.close(), 600);
        } catch (err) {
            console.error("시설 등록 실패:", err);
            setToast({
                open: true,
                message: "등록 실패",
                severity: "error",
            });
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") window.close();
        });
        try {
            window.resizeTo(520, 820);
        } catch {}
    }, []);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                bgcolor: "#fafafa",
                p: 2,
            }}
        >
            <Paper elevation={4} sx={{ width: 520, borderRadius: 3, p: 3 }}>
                <Stack spacing={2}>
                    <StartTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AddBusinessIcon fontSize="small" /> 새 시설 등록
                    </StartTitle>

                    <SmallerSubTitle>
                        시설 정보를 입력하여 신규 시설을 등록합니다.
                    </SmallerSubTitle>

                    {/* 시설명 */}
                    <Contents100 bold>시설명</Contents100>
                    <TextField
                        size="medium"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="예: 한빛 재활 스포츠센터"
                        InputProps={{
                            sx: { height: 48 },
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BusinessOutlinedIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* 주소 */}
                    <Contents100 bold>주소</Contents100>
                    <SearchMap
                        loca={city}
                        setLoca={setCity}
                        setLat={setGeoLat}
                        setLng={setGeoLng}
                    />

                    {/* 상세주소 */}
                    <TextField
                        size="medium"
                        fullWidth
                        value={detailAddr}
                        onChange={(e) => setDetailAddr(e.target.value)}
                        placeholder="상세주소 (선택)"
                        InputProps={{ sx: { height: 48 } }}
                    />

                    {/* 운영시간 */}
                    <Contents100 bold>운영시간</Contents100>
                    <TextField
                        size="medium"
                        fullWidth
                        value={openHours}
                        onChange={(e) => setOpenHours(e.target.value)}
                        placeholder="예: 09:00~18:00 / 주말 10:00~17:00"
                        InputProps={{ sx: { height: 48 } }}
                    />

                    {/* 시설 타입 */}
                    <Contents100 bold>시설 타입</Contents100>
                    <TextField
                        size="medium"
                        fullWidth
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="예: 헬스, 발레, 수영, 탁구 등"
                        InputProps={{ sx: { height: 48 } }}
                    />

                    {/* 접근성 */}
                    <Contents100 bold>접근성 정보</Contents100>
                    <TextField
                        size="medium"
                        fullWidth
                        value={accessibility}
                        onChange={(e) => setAccessibility(e.target.value)}
                        placeholder="예: 휠체어 접근 가능, 엘리베이터 있음"
                        InputProps={{
                            sx: { height: 48 },
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccessibleForwardOutlinedIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* 버튼 */}
                    <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                        <Button variant="text" onClick={() => window.close()}>
                            취소
                        </Button>
                        <Button
                            variant="contained"
                            disabled={disabled}
                            onClick={handleSubmit}
                            sx={{ height: 42 }}
                        >
                            등록
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

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
