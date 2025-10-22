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
      <Box sx={{ position: { lg: "sticky" }, top: { lg: 24 }, width: "100%" }}>
        <SectionBox label="사이드바" minH={480} />
      </Box>
    );
  }

  return (
    <Box sx={{ position: { lg: "sticky" }, top: { lg: 24 }, width: "100%" }}>
      <SectionBox minH={480}>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <Grid container justifyContent="space-between" alignItems="flex-start">
            <Grid item>
              <Typography variant="h5" fontWeight="bold">120,000 KRW</Typography>
              <Typography variant="caption" color="text.secondary">첫 수업 24시간 전 100% 환불</Typography>
            </Grid>
            <Grid item textAlign="right">
              <Typography variant="body2" color="text.secondary" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                <Users style={{ width: 16, height: 16 }} /> 9/16
              </Typography>
              <Typography variant="caption" sx={{ color: "success.main", fontWeight: 600, display: "block" }}>
                {spotsLeft} spots left
              </Typography>
            </Grid>
          </Grid>

          <Paper sx={{ m: 0, p: 2 }}>
            <Grid container justifyContent="space-between">
              <Typography variant="body2">Session</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {sessions.find((s) => s.id === sessionId)?.label}
              </Typography>
            </Grid>
            <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
              <Typography variant="body2">Date</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{date}</Typography>
            </Grid>
          </Paper>

          <Box>
            <OneAlignedButton size="large" buttonSx={{ width: "100%" }}>
              수강 신청
            </OneAlignedButton>
            <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1.5, textAlign: "center" }}>
              신청 시 정책에 동의하게 됩니다.
            </Typography>
          </Box>
        </Box>
      </SectionBox>
    </Box>
  );
}
