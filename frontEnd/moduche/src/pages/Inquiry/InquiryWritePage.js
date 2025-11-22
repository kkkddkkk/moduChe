// src/pages/Inquiry/InquiryWritePage.js

import React, { useState } from "react";
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
import { createInquiry } from "../../api/inquiryApi/inquiryApi";

export default function InquiryWritePage() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("SERVICE");
    const [content, setContent] = useState("");
    const [isSecret, setIsSecret] = useState(false);

    // 🔐 선택: 로그인한 사용자만 작성하도록 체크 가능
    // const token = localStorage.getItem("accessToken");
    // if (!token) {
    //     alert("로그인 후 이용해주세요.");
    //     navigate("/login");
    // }

    const handleSubmit = async () => {
        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }
        if (!content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        try {
            const body = {
                title,
                category,
                content,
                secret: isSecret,
            };

            await createInquiry(body);

            alert("문의가 등록되었습니다.");
            navigate("/inquiry/list");
        } catch (e) {
            console.error("문의 등록 실패:", e);
            alert("문의 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <Box sx={{ width: "100%", px: 2, mt: 4, mb: 10 }}>
            <Typography
                variant="h4"
                fontWeight={700}
                textAlign="center"
                sx={{ mb: 1 }}
            >
                문의 작성
            </Typography>

            <Typography
                variant="body1"
                textAlign="center"
                color="text.secondary"
                sx={{ mb: 4 }}
            >
                문의 내용을 자세히 작성해주세요.
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
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
                    <Stack spacing={2.5}>
                        {/* 제목 */}
                        <TextField
                            label="제목"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        {/* 카테고리 */}
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

                        {/* 비밀글 옵션 */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isSecret}
                                    onChange={(e) =>
                                        setIsSecret(e.target.checked)
                                    }
                                />
                            }
                            label="비밀글로 작성하기"
                            sx={{ mt: 1, mb: 1, pl: 0.5 }}
                        />

                        {/* 내용 */}
                        <TextField
                            label="내용"
                            fullWidth
                            multiline
                            minRows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        {/* 버튼 */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                pt: 1,
                            }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 600,
                                    width: 160,
                                    py: 1.2,
                                }}
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
