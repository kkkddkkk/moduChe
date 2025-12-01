// src/pages/Inquiry/InquiryWritePage.js

import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Stack,
    Button,
    Paper as MuiPaper,
    alpha,
    useTheme,
    FormControlLabel,
    Checkbox,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

// 🔥 Inquiry API (axiosInstance로 토큰 자동 첨부됨)
import { createInquiry } from "../../api/inquiryApi/inquiryUserApi";

import { isLoggedIn, isTokenExpired } from "../../utils/auth";

export default function InquiryWritePage() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("SERVICE");
    const [content, setContent] = useState("");
    const [isSecret, setIsSecret] = useState(false);

    /** 🔐 로그인 체크 */
    useEffect(() => {
        if (!isLoggedIn()) {
            alert("로그인 후 이용 가능합니다.");
            navigate("/account/login");
        }
    }, [navigate]); // ← navigate 의존성 추가

    /** 🔥 저장 */
    const handleSubmit = async () => {
        if (!title.trim()) return alert("제목을 입력해주세요.");
        if (!content.trim()) return alert("내용을 입력해주세요.");

        try {
            await createInquiry({
                title,
                category,
                content,
                secret: isSecret, // 🔥 백엔드와 필드명 일치
            });

            alert("문의가 성공적으로 등록되었습니다.");

            // 🔥 tab=my 기능을 실제로 반영하려면 InquiryListPage도 수정해야 함
            navigate("/inquiry/list?tab=my");

        } catch (err) {
            console.error("문의 등록 실패:", err);

            if (err.response?.status === 401) {
                alert("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
                navigate("/account/login");
                return;
            }

            alert("문의 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <Box sx={{ width: "100%", px: 2, mt: 4, mb: 10 }}>
            <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 1 }}>
                문의 작성
            </Typography>

            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                문의 내용을 자세히 작성해주세요.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <MuiPaper
                    elevation={3}
                    sx={{
                        width: "75%",
                        maxWidth: "850px",
                        p: 4,
                        borderRadius: 3,
                        border: `1px solid ${alpha("#000", 0.1)}`,
                        backgroundColor: theme.palette.background.paper,
                    }}
                >
                    <Stack spacing={3}>
                        <TextField
                            label="제목"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <TextField
                            select
                            label="카테고리"
                            fullWidth
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value="SERVICE">서비스 문의</MenuItem>
                            <MenuItem value="BUG">오류 신고</MenuItem>
                            <MenuItem value="SUGGEST">기능 제안</MenuItem>
                        </TextField>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isSecret}
                                    onChange={(e) => setIsSecret(e.target.checked)}
                                />
                            }
                            label="비밀글로 작성하기"
                        />

                        <TextField
                            label="내용"
                            fullWidth
                            multiline
                            minRows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ width: 160, py: 1.2 }}
                                onClick={handleSubmit}
                            >
                                등록하기
                            </Button>
                        </Box>
                    </Stack>
                </MuiPaper>
            </Box>
        </Box>
    );
}
