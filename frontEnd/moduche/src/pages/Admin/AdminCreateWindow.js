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
    IconButton,
} from "@mui/material";

import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import {
    StartTitle,
    SmallerSubTitle,
    Contents100,
} from "../../component/common/Text";

import { createAdmin } from "../../api/admin";

export default function AdminCreateWindowPage() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    // 기본값
    const roleId = 2;
    const status = "ACTIVE";

    const disabled = useMemo(
        () =>
            !username.trim() ||
            !name.trim() ||
            !password.trim() ||
            password.trim().length < 6,
        [username, name, password]
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (disabled) return;

        try {
            const newAdmin = await createAdmin({
                username: username.trim(),
                name: name.trim(),
                password: password.trim(),
                phone: phone.trim() || null,
                email: null,
            });

            // 부모 창으로 전달 (백엔드가 생성한 실제 AdminResponse)
            window.opener?.postMessage(
                { type: "ADMIN_CREATED", payload: newAdmin },
                window.location.origin
            );

            setToast({
                open: true,
                message: "관리자 계정이 생성되었습니다.",
                severity: "success",
            });

            setTimeout(() => window.close(), 700);
        } catch (err) {
            console.error(err);

            const msg =
                err?.response?.data?.message ||
                "생성에 실패했습니다. 입력값을 확인하세요.";

            setToast({
                open: true,
                message: msg,
                severity: "error",
            });
        }
    };

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && window.close();
        window.addEventListener("keydown", onKey);
        try {
            window.resizeTo(520, 620);
        } catch {}
        document.title = "새 관리자 추가";
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
                sx={{
                    width: 520,
                    maxWidth: "100%",
                    borderRadius: 3,
                    p: 3,
                }}
            >
                <Stack spacing={2}>
                    <StartTitle
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                        <PersonAddAltIcon fontSize="small" /> 새 관리자 추가
                    </StartTitle>

                    <SmallerSubTitle>
                        관리자 계정을 생성합니다.
                    </SmallerSubTitle>

                    {/* UID */}
                    <Contents100 bold>계정명(UID)</Contents100>
                    <TextField
                        size="small"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="예: admin001"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BadgeOutlinedIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* 이름 */}
                    <Contents100 bold>이름</Contents100>
                    <TextField
                        size="small"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="예: 홍길동"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonAddAltIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* 전화번호 */}
                    <Contents100 bold>전화번호</Contents100>
                    <TextField
                        size="small"
                        fullWidth
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="예: 01012341234"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhoneIphoneIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* 비밀번호 */}
                    <Contents100 bold>비밀번호</Contents100>
                    <TextField
                        size="small"
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호 (6자 이상)"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PasswordOutlinedIcon fontSize="small" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
                                    >
                                        {showPassword ? (
                                            <VisibilityOffIcon />
                                        ) : (
                                            <VisibilityIcon />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

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
                autoHideDuration={2200}
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
