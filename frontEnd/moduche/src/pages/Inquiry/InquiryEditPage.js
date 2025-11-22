// src/pages/Inquiry/InquiryEditPage.js

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

import { useParams, useNavigate } from "react-router-dom";

import {
    fetchInquiryDetail,
    updateInquiry,
} from "../../api/inquiryApi/inquiryApi";

export default function InquiryEditPage() {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("SERVICE");
    const [content, setContent] = useState("");
    const [isSecret, setIsSecret] = useState(false);

    // 단일 상세 조회 API 사용 (/inquiries/{id})
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchInquiryDetail(id);

                setTitle(data.title);
                setCategory(data.category);
                setContent(data.content);
                setIsSecret(data.secret);

                setLoading(false);
            } catch (e) {
                console.error("문의 상세 조회 실패:", e);

                if (e.response?.status === 403) {
                    alert("해당 문의글을 수정할 권한이 없습니다.");
                } else {
                    alert("문의 정보를 불러올 수 없습니다.");
                }

                navigate("/inquiry/list");
            }
        };

        load();
    }, [id, navigate]);

    // 수정 요청
    const handleEdit = async () => {
        try {
            await updateInquiry(id, {
                title,
                content,
                category,
                secret: isSecret,
            });

            alert("문의가 성공적으로 수정되었습니다.");
            navigate("/inquiry/list");
        } catch (e) {
            console.error("문의 수정 실패:", e);
            alert("수정에 실패했습니다.");
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ width: "100%", px: 2, mt: 4, mb: 10 }}>
            <Typography
                variant="h4"
                fontWeight={700}
                textAlign="center"
                sx={{ mb: 1 }}
            >
                문의 수정
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
                sx={{ mb: 4 }}
            >
                문의 내용을 수정하세요.
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                <MuiPaper
                    elevation={2}
                    sx={{
                        width: "75%",
                        maxWidth: "850px",
                        p: 4,
                        borderRadius: 3,
                        border: `1px solid ${alpha("#000", 0.15)}`,
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
                                    onChange={(e) =>
                                        setIsSecret(e.target.checked)
                                    }
                                />
                            }
                            label="비밀글로 설정"
                        />

                        <TextField
                            label="내용"
                            fullWidth
                            multiline
                            minRows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
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
                                onClick={handleEdit}
                            >
                                수정하기
                            </Button>
                        </Box>
                    </Stack>
                </MuiPaper>
            </Box>
        </Box>
    );
}
