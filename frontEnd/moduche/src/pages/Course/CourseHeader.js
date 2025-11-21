import { Box, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import { Calendar, Clock, MapPin } from "lucide-react";
import { StandardSelect } from "../../component/common/CustomSelect";
import SectionBox from "./SectionBox";
import IconText from "./IconText";

export default function CourseHeader({
  hasHeader,
  sessions,
  datesBySession,
  sessionId,
  setSessionId,
  date,
  setDate,
  showMeta = true,
  emphasizeByline = false,

  titleText,
  bylineName,
  bylineOrg,
  periodStart,
  periodEnd,
  scheduleLine,
  tags = [],
  locationText,
}) {
  if (!hasHeader) return <SectionBox label="헤더 정보" />;

  // 🔹 1) 기간 텍스트 계산 (기존 값 우선, 없으면 sessions/datesBySession 기반으로 생성)
  let periodText = "";
  if (periodStart && periodEnd) {
    periodText = `${periodStart} → ${periodEnd}`;
  } else if (datesBySession && Object.keys(datesBySession).length > 0) {
    const sessionIds = Object.keys(datesBySession);
    const firstSessionDates = datesBySession[sessionIds[0]] || [];
    const lastSessionDates =
      datesBySession[sessionIds[sessionIds.length - 1]] || [];

    const firstDateText = firstSessionDates[0];
    const lastDateText =
      lastSessionDates[lastSessionDates.length - 1] || firstDateText;

    if (firstDateText && lastDateText) {
      periodText = `${firstDateText} ~ ${lastDateText}`;
    }
  }

  if (!periodText) {
    periodText = "기간 정보 없음";
  }

  // 🔹 2) 스케줄 텍스트 계산 (기존 scheduleLine 우선, 없으면 선택된 세션/날짜로 생성)
  let scheduleText = scheduleLine;

  if (!scheduleText) {
    const currentSession = sessions?.find((s) => s.id === sessionId);
    if (currentSession && date) {
      scheduleText = `${currentSession.label} • ${date}`;
    } else if (currentSession) {
      scheduleText = currentSession.label;
    } else if (sessions && sessions.length > 0) {
      scheduleText = sessions[0].label;
    } else {
      scheduleText = "일정 정보 없음";
    }
  }

  return (
    <SectionBox>
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          height: "100%",
        }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h5" fontWeight="bold">
            {titleText ?? "Untitled Course"}
          </Typography>

          <Typography
            variant={emphasizeByline ? "body1" : "body2"}
            color="text.secondary"
            sx={{ fontWeight: emphasizeByline ? 600 : 400 }}
          >
            by <b>{bylineName ?? "Instructor"}</b> ·{" "}
            {bylineOrg ?? "Organization"}
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap" pt={1}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "24px 1fr",
                rowGap: 0.5,
                columnGap: 1,
                alignItems: "center",
                "& .icon": { width: 20, height: 20, display: "block" },
              }}
            >
              <Calendar className="icon" />
              <Typography color="text.secondary" sx={{ fontSize: "1.4rem" }}>
                {periodText}
              </Typography>

              <Clock className="icon" />
              <Typography color="text.secondary" sx={{ fontSize: "1.4rem" }}>
                {scheduleText}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        <Divider />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "inline-flex", gap: 0.5 }}
        >
          <MapPin size={16} /> {locationText ?? "장소 정보 없음"}
        </Typography>
      </Box>
    </SectionBox>
  );
}
