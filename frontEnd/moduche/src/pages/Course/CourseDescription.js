import Paper from "../../component/common/Paper";
import { Box, Chip, Typography, Stack } from "@mui/material";
import { MapPin } from "lucide-react";

export default function CourseDescription({
  hasDetail,
  html,
  tags = [],
  locationText,
}) {
  return (
    <Paper
      sx={{
        p: 3,
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 🔥 태그 & 위치 상단 영역 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
          px: 0.5,
        }}
      >
        {/* 주소 */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <MapPin size={16} />
          {locationText ?? "장소 정보 없음"}
        </Typography>
      </Box>

      {/* 제목 */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        강좌 소개
      </Typography>

      {/* 본문 */}
      <Box sx={{ mt: 1, flex: 1 }}>
        {html ? (
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
