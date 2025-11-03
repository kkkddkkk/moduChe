// src/pages/Admin/AdminCreateWindow.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, TextField, Button, Paper, Stack, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AdminCreateWindow() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [idError, setIdError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const regId = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,16}$/;
  const regPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!~@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;
  const regPhone = /^01[016789]-?\d{3,4}-?\d{4}$/;

  useEffect(() => setIdError(id.length > 0 && !regId.test(id)), [id]);
  useEffect(() => setPwError(password.length > 0 && !regPassword.test(password)), [password]);
  useEffect(() => setPhoneError(phone.length > 0 && !regPhone.test(phone)), [phone]);

  const disabled = useMemo(
    () => !id || !password || !name || !phone || idError || pwError || phoneError,
    [id, password, name, phone, idError, pwError, phoneError]
  );

  const generateUid = () => `A${String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0")}`;

  const nowStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;

    const payload = {
      uid: generateUid(),
      name,
      email: "",
      role: "OPERATOR",
      status: "ACTIVE",
      createdAt: nowStr(),
      _raw: { id, password, phone },
    };

    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: "ADMIN_CREATED", payload }, window.location.origin);
    }
    window.close();
  };

  // 팝업 UX: ESC 눌러 닫기
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") window.close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: (t) => (t.palette.mode === "dark" ? t.palette.background.default : t.palette.grey[100]),
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 3,
          p: 3,
          bgcolor: "background.paper",
        }}
      >
        {/* 헤더(앱 헤더 아님) */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={700}>
            새 관리자 추가
          </Typography>
          <IconButton size="small" onClick={() => window.close()} aria-label="닫기">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          관리자 로그인에 사용할 기본 정보를 입력하세요.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 1.5 }}>
          <TextField
            autoFocus
            size="small"
            label="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            error={idError}
            helperText={idError ? "5~16자, 영문+숫자 조합" : " "}
            fullWidth
          />

          <TextField
            size="small"
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={pwError}
            helperText={pwError ? "6자 이상, 영문+숫자+특수문자" : " "}
            fullWidth
          />

          <TextField
            size="small"
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <TextField
            size="small"
            label="전화번호 (예: 010-1234-5678)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={phoneError}
            helperText={phoneError ? "전화번호 형식이 올바르지 않습니다." : " "}
            fullWidth
          />

          <Stack direction="row" spacing={1.5} sx={{ mt: 0.5 }}>
            <Button onClick={() => window.close()} sx={{ textTransform: "none" }}>
              취소
            </Button>
            <Button type="submit" variant="contained" disabled={disabled} sx={{ textTransform: "none" }}>
              생성
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
