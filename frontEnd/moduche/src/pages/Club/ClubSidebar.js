import { Box, Grid, Typography } from "@mui/material";
import { Users, CalendarHeart } from "lucide-react";
import { OneAlignedButton } from "../../component/common/Button";
import Paper from "../../component/common/Paper";
import SectionBox from "../Course/SectionBox"; // 경로 유지(필요시 조정)

export default function ClubSidebar({
  hasSidebar,
  clubData,
}) {
  if (!hasSidebar) {
    return (
      <Box sx={{ position: { lg: "sticky" }, top: { lg: "88px" }, width: "100%" }}>
        <SectionBox label="사이드바" />
      </Box>
    );
  }

  const { memberCount = 0, capacity = 0, schedule = "-" } = clubData || {};

  return (
    <Box
      sx={{
        position: { lg: "sticky" },
        top: "88px",
        width: "100%",
        alignSelf: "flex-start",
      }}
    >
      <SectionBox>
        <Box
          sx={{
            p: 3,                               // ⬅️ CourseSidebar와 동일
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 3,                             // ⬅️ 섹션 간 기본 간격
            minHeight: { xs: 380, md: 460 },    // ⬅️ 세로 여유(동일)
          }}
        >
          {/* 상단 요약 (CourseSidebar의 가격/정원 영역 대응) */}
          <Grid container justifyContent="space-between" alignItems="flex-start">
            <Grid item>
              <Typography variant="h5" fontWeight="bold">
                가입비 없음
              </Typography>
              <Typography variant="caption" color="text.secondary">
                언제든 편하게 참여하세요!
              </Typography>
            </Grid>
            <Grid item textAlign="right">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
              >
                <Users style={{ width: 16, height: 16 }} /> {memberCount} / {capacity}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "success.main", fontWeight: 600, display: "block", mt: 0.5 }}
              >
                {Math.max(capacity - memberCount, 0)} 자리 남음
              </Typography>
            </Grid>
          </Grid>

          {/* 일정 카드 (CourseSidebar의 Session/Date 카드와 동일한 스타일/여백) */}
          <Paper
            sx={{
              m: 0,
              p: 2.5,                 // ⬅️ 동일
              borderRadius: 2,
              bgcolor: "grey.50",
              mt: 0.5,
              mb: 1.5,                // ⬅️ 버튼과의 간격
            }}
          >
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                정기 일정
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 1 }}>
                <CalendarHeart size={16} />
                {schedule}
              </Typography>
            </Grid>
          </Paper>

          {/* CTA 버튼 + 안내문 (간격/크기 CourseSidebar와 동일) */}
          <Box>
            <OneAlignedButton
              size="large"
              buttonSx={{
                width: "100%",
                py: 1.3,              // ⬅️ 버튼 세로 여유
                fontWeight: 600,
              }}
            >
              동호회 가입
            </OneAlignedButton>
            <Typography
              variant="caption"
              color="text.secondary"
              component="p"
              sx={{ mt: 2, textAlign: "center" }}  // ⬅️ 버튼 아래 간격
            >
              참여 시 커뮤니티 가이드에 동의하게 됩니다.
            </Typography>
          </Box>
        </Box>
      </SectionBox>
    </Box>
  );
}
