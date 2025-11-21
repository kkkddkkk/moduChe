// src/pages/Course/CourseDescription.jsx
import { Box, Typography } from "@mui/material";
import Paper from "../../component/common/Paper";

export default function CourseDescription({ hasDetail, html }) {
  return (
    <Paper
      sx={{
        p: 3,
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        강좌 소개
      </Typography>

      <Box sx={{ mt: 1, flex: 1 }}>
        {html ? (
          // 🔥 에디터에서 온 HTML 그리기
          <div
            style={{ lineHeight: 1.6, whiteSpace: "normal" }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <Typography color="text.secondary">
            설명이 아직 등록되지 않았습니다.
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
