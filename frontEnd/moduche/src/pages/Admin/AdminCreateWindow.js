import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Paper,
    Stack,
    Button,
    Snackbar,
    Alert,
    Fade,
    InputAdornment,
} from "@mui/material";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import CustomTextField from "../../component/common/CustomTextField";
import {
    StartTitle,
    SmallerSubTitle,
    Contents100,
} from "../../component/common/Text";

import { createAdmin } from "../../api/admin"; // ★ 백엔드 관리자 생성 API

export default function AdminCreateWindow() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    // 정규식
    const regId = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,16}$/;
    const regPassword =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!~@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;
    const regPhone = /^01[016789]-?\d{3,4}-?\d{4}$/;

    const idError = id.length > 0 && !regId.test(id);
    const pwError = password.length > 0 && !regPassword.test(password);
    const phoneError = phone.length > 0 && !regPhone.test(phone);

    const disabled = useMemo(
        () =>
            !id ||
            !password ||
            !name ||
            !phone ||
            idError ||
            pwError ||
            phoneError,
        [id, password, name, phone, idError, pwError, phoneError]
    );

    // ★ 관리자 생성 실행
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (disabled) return;

        const payload = {
            username: id,
            password: password,
            name: name,
            phone: phone,
            email: "",
            roleId: 2, // ★ 일반 관리자 역할 ID = 2
        };

        try {
            const saved = await createAdmin(payload); // ★ DB 저장

            // ★ 결과를 부모창으로 전송 → 목록 즉시 반영
            window.opener?.postMessage(
                { type: "ADMIN_CREATED", payload: saved },
                window.origin
            );

            setToast({
                open: true,
                message: "관리자가 생성되었습니다.",
                severity: "success",
            });

            setTimeout(() => window.close(), 700);
        } catch (err) {
            console.error("관리자 생성 실패:", err);
            setToast({
                open: true,
                message: "생성 실패. 관리자에게 문의하세요.",
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
                sx={{ width: 520, maxWidth: "100%", borderRadius: 3, p: 3 }}
            >
                <Stack spacing={2}>
                    <StartTitle
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                        <PersonAddAlt1Icon fontSize="small" /> 새 관리자 추가
                    </StartTitle>

                    <SmallerSubTitle>
                        관리자 로그인에 사용할 기본 정보를 입력하세요.
                    </SmallerSubTitle>

                    {/* 아이디 */}
                    <Contents100 bold>아이디</Contents100>
                    <CustomTextField
                        data={id}
                        setData={() => {}}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="영문+숫자 5~16자"
                        fontSize={15}
                        padding={10}
                        rest={{
                            error: idError,
                            helperText: idError
                                ? "형식: 영문+숫자 5~16자"
                                : " ",
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        sx={{ pl: 1 }}
                                    >
                                        <PersonOutlineIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {/* 비밀번호 */}
                    <Contents100 bold>비밀번호</Contents100>
                    <CustomTextField
                        data={password}
                        setData={() => {}}
                        onChange={(e) => setPassword(e.target.value)}
                        show={false}
                        placeholder="영문+숫자+특수문자 6자 이상"
                        fontSize={15}
                        padding={10}
                        rest={{
                            error: pwError,
                            helperText: pwError
                                ? "형식: 영문+숫자+특수문자 6자 이상"
                                : " ",
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        sx={{ pl: 1 }}
                                    >
                                        <LockOutlinedIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {/* 이름 */}
                    <Contents100 bold>이름</Contents100>
                    <CustomTextField
                        data={name}
                        setData={() => {}}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="이름을 입력하세요."
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

                    {/* 전화번호 */}
                    <Contents100 bold>전화번호</Contents100>
                    <CustomTextField
                        data={phone}
                        setData={() => {}}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="010-1234-5678"
                        fontSize={15}
                        padding={10}
                        rest={{
                            error: phoneError,
                            helperText: phoneError
                                ? "형식: 010-1234-5678"
                                : " ",
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        sx={{ pl: 1 }}
                                    >
                                        <PhoneAndroidOutlinedIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
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
                            생성
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
