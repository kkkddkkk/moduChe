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

  // =============================================
  //  🔥 입력 누락 검사 포함된 handleSubmit
  // =============================================
  const handleSubmit = (e) => {
    e.preventDefault();

    const missingFields = [];

    // 제목 체크
    if (!form.title?.trim()) missingFields.push("제목");

    // HTML 태그 제거해 텍스트만 검사
    const plainContent = (form.content || "").replace(/<(.|\n)*?>/g, "").trim();

    if (!plainContent) missingFields.push("내용");

    if (missingFields.length > 0) {
      alert(`입력 누락 항목: ${missingFields.join(", ")}`);
      console.warn("❌ 누락 필드:", missingFields);
      console.table(form);
      return;
    }

    console.group("📤 제출 직전 form 데이터");
    console.table(form);
    console.groupEnd();

    // 상위 submit 호출
    onSubmit(e);
  };

  // 취소 버튼
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
      <CenterTitle sx={{ mb: isMobile || isTablet ? 4 : 6, fontWeight: 600 }}>
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

        {/* 🔥 onSubmit={handleSubmit} 로 변경됨 */}
        <form onSubmit={handleSubmit}>
          <Paper
            sx={{
              p: 3,
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
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
            {/* 제목 */}
            <Grid size={12} sx={{ mb: 3 }}>
              <RegisterTitle title={"홍보글 제목"} />
              <CustomTextField
                setData={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    title: value,
                  }))
                }
                placeholder={"게시될 홍보글의 제목을 입력해주세요"}
                padding={10}
              />
            </Grid>

            {/* 내용 */}
            <Grid size={12} sx={{ mb: 3 }}>
              <RegisterTitle title={"홍보글 내용"} />

              <Box
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  overflow: "hidden",
                }}
              >
                <RichTextEditor
                  value={form.content || ""}
                  onChange={(value) => {
                    // HTML 태그 제거해서 순수 텍스트만 추출
                    const plain = (value || "")
                      .replace(/<(.|\n)*?>/g, "")
                      .trim();

                    setForm((prev) => ({
                      ...prev,
                      content: value, // 화면에 쓸 HTML
                      description: plain, // 🔥 강좌 쪽에서 쓰는 순수 텍스트
                    }));
                  }}
                />
              </Box>
            </Grid>

            {/* 해시태그 */}
            <Grid size={12} sx={{ mb: 3 }}>
              <RegisterTitle title={"해시태그"} />
              <HashTagInput form={form} setForm={setForm} />
            </Grid>

            {/* 이미지 업로드 */}
            <Grid size={12} sx={{ mb: 3 }}>
              <ImageUpload form={form} setForm={setForm} />
            </Grid>
          </Paper>

          {/* 버튼 */}
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
