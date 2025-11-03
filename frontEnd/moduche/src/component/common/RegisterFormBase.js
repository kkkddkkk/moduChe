import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    useTheme,
    useMediaQuery,
    alpha,
} from "@mui/material";
import Paper from "./Paper";
import { CenterTitle, SubTitle } from "./Text";
import Layout from "./Layout";
import { RegisterTitle } from "../community/RegisterTitle";
import CustomTextField from "./CustomTextField";
import { HashTagInput } from "./HashTagInput";
import { useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { Sparkles, Star, UserRoundPen } from "lucide-react";
import { useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import RichTextEditor from "./RichTextEditor";
import { OneAlignedButton } from "./Button";

const RegisterFormBase = ({
    form,
    setForm,
    onChange,
    onImageUpload,
    onSubmit,
    extraFields,
    title,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
    // ✅ 제출 전에 검증 & 로그 출력
    const handleSubmit = (e) => {
        e.preventDefault();

        const missingFields = [];
        if (!form.title?.trim()) missingFields.push("제목");
        if (!form.content?.trim()) missingFields.push("내용");

        if (missingFields.length > 0) {
            alert(`입력 누락 항목: ${missingFields.join(", ")}`);
            console.warn("❌ 누락 필드:", missingFields);
            console.table(form);
            return;
        }

        console.group("✅ 폼 제출 직전 데이터 로그");
        console.table(form);
        console.groupEnd();

        onSubmit(e); // ← 상위 onSubmit으로 실제 처리 위임
    };

    // ✅ 취소 버튼
    const handleCancel = () => {
        if (window.confirm("작성 중인 내용을 모두 취소하시겠습니까?")) {
            window.history.back();
        }
    };

    return (
        <Box
            sx={{
                p: isMobile || isTablet ? 0 : 2,
                pt: isMobile || isTablet ? 2 : 0,
                justifyContent: "center",
            }}
        >
            <CenterTitle
                sx={{ mb: isMobile || isTablet ? 4 : 6, fontWeight: 600 }}
            >
                {title}
            </CenterTitle>
            <Layout>{extraFields}</Layout>

            <Grid size={12} sx={{ pt: isMobile || isTablet ? 2 : 4 }}>
                <SubTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        pl: 2,
                    }}
                >
                    <UserRoundPen color={theme.palette.primary.main} />
                    홍보글 정보
                </SubTitle>
                <form onSubmit={onSubmit}>
                    <Paper
                        sx={{
                            p: 3,
                            position: "relative",
                            borderRadius: 2,
                            overflow: "hidden",
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${alpha(
                                theme.palette.primary.main,
                                0.3
                            )}`,
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                top: 0,
                                width: 4,
                                height: "100%",
                                borderRadius: `100px 0 0 100px`,
                                backgroundColor: theme.palette.primary.main,
                            },
                        }}
                    >
                        <Grid size={12} sx={{ mb: 3 }}>
                            <RegisterTitle title={"홍보글 제목"} />
                            <CustomTextField
                                setData={(value) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        title: value,
                                    }))
                                }
                                placeholder={
                                    "예: 사랑과 낭만을 쫓는 사람들의 모임"
                                }
                                padding={10}
                            />
                        </Grid>

                        <Grid size={12} sx={{ mb: 3 }}>
                            <RegisterTitle title={"홍보글 내용"} />

                            {/* 리액트 19 호환 퀼 커스텀 컴포넌트로 빼둠 => (이름: RichTextEditor) */}
                            {/* 추가 데코레이션 기능 있으시면 문의 주시면 추가해두겠습니다: 고은설. */}
                            <Box
                                sx={{
                                    backgroundColor:
                                        theme.palette.background.paper,
                                    overflow: "hidden",
                                }}
                            >
                                <RichTextEditor
                                    value={form.content || ""}
                                    onChange={(value) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            content: value,
                                        }))
                                    }
                                />
                            </Box>
                        </Grid>
                        <Grid size={12} sx={{ mb: 3 }}>
                            <RegisterTitle title={"해시태그"} />
                            {/* 해시태그 입력 컴포넌트 */}
                            <HashTagInput form={form} setForm={setForm} />
                        </Grid>
                        <Grid size={12} sx={{ mb: 3 }}>
                            <ImageUpload form={form} setForm={setForm} />
                        </Grid>
                    </Paper>
                    <Grid container size={12} mt={4} mb={2} p={2}>
                        <Grid size={1.5}>
                            <OneAlignedButton
                                variant="outlined"
                                sx={{ height: "100%", width: "100%" }}
                                buttonWrapperSx={{ width: "100%" }}
                                onClick={handleCancel}
                            >
                                등록 취소
                            </OneAlignedButton>
                        </Grid>
                        <Grid size={8} />
                        <Grid size={2.5}>
                            <OneAlignedButton
                                sx={{ height: "100%", width: "100%" }}
                                type="submit"
                                buttonWrapperSx={{ width: "100%" }}
                            >
                                등록 요청 제출
                            </OneAlignedButton>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Box>
    );
};

export default RegisterFormBase;
