import React, { useState, useMemo, useEffect } from "react";
import {
    Box,
    Paper,
    Stack,
    Button,
    MenuItem,
    Snackbar,
    Alert,
    Fade,
    InputAdornment,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LinkIcon from "@mui/icons-material/Link";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import NumbersIcon from "@mui/icons-material/Numbers";
import TitleIcon from "@mui/icons-material/Title";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

import CustomTextField from "../../component/common/CustomTextField";
import {
    StartTitle,
    SmallerSubTitle,
    Contents100,
} from "../../component/common/Text";

export default function BannerCreateWindow() {
    const genBannerId = () => `BNR-${Date.now()}`;
    const genAdminId = () =>
        `ADM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const [banner, setBanner] = useState({
        id: genBannerId(),
        adminId: genAdminId(), // ✅ 자동 생성, 수정 불가
        title: "",
        imagePath: "",
        linkUrl: "",
        position: "메인",
        startDate: "",
        endDate: "",
        order: 1,
    });

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const [error, setError] = useState(null);

    const onChange = (key) => (e) =>
        setBanner((p) => ({ ...p, [key]: e.target.value }));

    const validate = useMemo(() => {
        if (!banner.title.trim()) return "배너 제목을 입력하세요.";
        if (!banner.imagePath.trim()) return "이미지 경로를 입력하세요.";
        if (!banner.linkUrl.trim()) return "이동 URL을 입력하세요.";
        if (!banner.startDate) return "게시 시작일을 선택하세요.";
        if (!banner.endDate) return "게시 종료일을 선택하세요.";
        return null;
    }, [banner]);

    const handleSubmit = () => {
        setError(null);
        if (validate) {
            setError(validate);
            return;
        }

        const payload = {
            banner_id: banner.id,
            admin_id: banner.adminId, // ✅ 함께 전달
            title: banner.title,
            image_url: banner.imagePath,
            target_url: banner.linkUrl,
            location: banner.position,
            start_date: banner.startDate,
            end_date: banner.endDate,
            order_index: banner.order,
        };

        try {
            window.opener?.postMessage(
                { type: "BANNER_CREATED", payload },
                window.origin
            );
            setToast({
                open: true,
                message: "새 배너가 등록되었습니다.",
                severity: "success",
            });
            setTimeout(() => window.close(), 800);
            // 다음 입력 대비 초기화가 필요하면 아래 주석 해제
            // setBanner({ id: genBannerId(), adminId: genAdminId(), title: "", imagePath: "", linkUrl: "", position: "메인", startDate: "", endDate: "", order: banner.order + 1 });
        } catch {
            setToast({
                open: true,
                message: "데이터 전송 실패",
                severity: "error",
            });
        }
    };

    useEffect(() => {
        document.title = "새 배너 등록";
        try {
            window.resizeTo(520, 640);
        } catch {}
    }, []);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: (t) =>
                    t.palette.mode === "dark"
                        ? t.palette.background.default
                        : "#fafafa",
                display: "grid",
                placeItems: "center",
                p: 2,
            }}
        >
            <Paper
                elevation={4}
                sx={{ width: 520, maxWidth: "100%", p: 3, borderRadius: 3 }}
            >
                <Stack spacing={2}>
                    <StartTitle
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                        <AddPhotoAlternateIcon fontSize="small" /> 새 배너 등록
                    </StartTitle>
                    <SmallerSubTitle>
                        사이트에 표시될 배너 정보를 입력하세요.
                    </SmallerSubTitle>

                    {error && (
                        <Fade in>
                            <Alert severity="error" variant="outlined">
                                {error}
                            </Alert>
                        </Fade>
                    )}

                    {/* 배너 ID */}
                    <Contents100 bold>배너 ID</Contents100>
                    <CustomTextField
                        data={banner.id}
                        setData={() => {}}
                        disabled
                        fontSize={15}
                        padding={10}
                        rest={{
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        sx={{ pl: 1 }}
                                    >
                                        <NumbersIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {/* ✅ 관리자 ID (자동 생성, 수정 불가) */}
                    <Contents100 bold>관리자 ID</Contents100>
                    <CustomTextField
                        data={banner.adminId}
                        setData={() => {}}
                        disabled
                        fontSize={15}
                        padding={10}
                        rest={{
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        sx={{ pl: 1 }}
                                    >
                                        <BadgeOutlinedIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {/* 제목 */}
                    <Contents100 bold>배너 제목</Contents100>
                    <CustomTextField
                        data={banner.title}
                        setData={() => {}}
                        onChange={onChange("title")}
                        placeholder="예: 여름 프로모션"
                        fontSize={15}
                        padding={10}
                        rest={{
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        sx={{ pl: 1 }}
                                    >
                                        <TitleIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {/* 이미지 경로 */}
                    <Contents100 bold>배너 이미지 경로</Contents100>
                    <CustomTextField
                        data={banner.imagePath}
                        setData={() => {}}
                        onChange={onChange("imagePath")}
                        placeholder="/images/banner1.jpg"
                        fontSize={15}
                        padding={10}
                        rest={{
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        sx={{ pl: 1 }}
                                    >
                                        <CollectionsOutlinedIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {/* 클릭 경로 */}
                    <Contents100 bold>클릭 이동 경로</Contents100>
                    <CustomTextField
                        data={banner.linkUrl}
                        setData={() => {}}
                        onChange={onChange("linkUrl")}
                        placeholder="https://example.com"
                        fontSize={15}
                        padding={10}
                        rest={{
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        sx={{ pl: 1 }}
                                    >
                                        <LinkIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {/* 노출 위치 */}
                    <Contents100 bold>노출 위치</Contents100>
                    <CustomTextField
                        data={banner.position}
                        setData={() => {}}
                        select
                        onChange={onChange("position")}
                        fontSize={15}
                        padding={10}
                    >
                        <MenuItem value="메인">메인</MenuItem>
                        <MenuItem value="서브">서브</MenuItem>
                        <MenuItem value="푸터">푸터</MenuItem>
                    </CustomTextField>

                    {/* 기간 */}
                    <Contents100 bold>게시 시작일</Contents100>
                    <CustomTextField
                        data={banner.startDate}
                        setData={() => {}}
                        onChange={onChange("startDate")}
                        type="date"
                        fontSize={15}
                        padding={10}
                        rest={{
                            InputLabelProps: { shrink: true },
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        sx={{ pl: 1 }}
                                    >
                                        <CalendarMonthIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Contents100 bold>게시 종료일</Contents100>
                    <CustomTextField
                        data={banner.endDate}
                        setData={() => {}}
                        onChange={onChange("endDate")}
                        type="date"
                        fontSize={15}
                        padding={10}
                        rest={{
                            InputLabelProps: { shrink: true },
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        sx={{ pl: 1 }}
                                    >
                                        <CalendarMonthIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {/* 출력 순서 */}
                    <Contents100 bold>출력 순서</Contents100>
                    <CustomTextField
                        data={banner.order}
                        setData={() => {}}
                        onChange={onChange("order")}
                        type="number"
                        fontSize={15}
                        padding={10}
                        rest={{
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        sx={{ pl: 1 }}
                                    >
                                        <NumbersIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Stack
                        direction="row"
                        spacing={1.5}
                        justifyContent="flex-end"
                        sx={{ pt: 1 }}
                    >
                        <Button variant="text" onClick={() => window.close()}>
                            취소
                        </Button>
                        <Button variant="contained" onClick={handleSubmit}>
                            등록
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={toast.severity} variant="filled">
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
