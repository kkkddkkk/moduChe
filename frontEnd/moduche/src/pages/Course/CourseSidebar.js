import { Box, Grid, Typography } from "@mui/material";
import { Users } from "lucide-react";
import { OneAlignedButton } from "../../component/common/Button";
import Paper from "../../component/common/Paper";
import SectionBox from "./SectionBox";

export default function CourseSidebar({
  hasSidebar,
  spotsLeft,
  sessions,
  sessionId,
  date,
}) {
  if (!hasSidebar) {
    return (
      <Box
        sx={{ position: { lg: "sticky" }, top: { lg: "88px" }, width: "100%" }}
      >
        <SectionBox label="사이드바" />
      </Box>
    );
  }

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
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 3, // ✅ 각 섹션 간 기본 간격 확보
            minHeight: { xs: 380, md: 460 }, // ✅ 세로 높이 여유
          }}
        >
          {/* 상단 가격/정원 요약 */}
          <Grid
            container
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Grid item>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ fontSize: "2rem" }}
              >
                120,000 KRW
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "1rem" }}
              >
                첫 수업 24시간 전 100% 환불
              </Typography>
            </Grid>
            <Grid item textAlign="right">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: "2rem",
                }}
              >
                <Users style={{ width: 16, height: 16 }} /> 9/16
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "success.main",
                  fontWeight: 600,
                  display: "block",
                  mt: 0.5,
                  fontSize: "1rem",
                }}
              >
                {spotsLeft} spots left
              </Typography>
            </Grid>
          </Grid>

          {/* 세션/날짜 카드 */}
          <Paper
            sx={{
              m: 0,
              p: 2.5,
              borderRadius: 2,
              bgcolor: "grey.50",
              mt: 0.5,
              mb: 1.0, // ✅ 버튼과의 간격 확보
            }}
          >
            <Grid container justifyContent="space-between">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "1.3rem" }}
              >
                Session
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, fontSize: "1.3rem" }}
              >
                {sessions.find((s) => s.id === sessionId)?.label}
              </Typography>
            </Grid>
            <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "1.3rem" }}
              >
                Date
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, fontSize: "1.3rem" }}
              >
                {date}
              </Typography>
            </Grid>
          </Paper>

          {/* 수강신청 버튼 + 안내문 */}
          <Box>
            <OneAlignedButton
              size="large"
              buttonSx={{
                width: "100%",
                py: 1.3, // ✅ 버튼 세로 여유
                fontWeight: 600,
              }}
              buttonWrapperSx={{
                width: "100%",
              }}
            >
              수강 신청
            </OneAlignedButton>

            <Typography
              variant="caption"
              color="text.secondary"
              component="p"
              sx={{
                mt: 2,
                textAlign: "center",
                fontSize: "0.95rem",
                lineHeight: 1.45,
              }} // ✅ 버튼 아래 간격 강화
            >
              신청 시 정책에 동의하게 됩니다.
            </Typography>
          </Box>
        </Box>
      </SectionBox>
    </Box>
  );
}
