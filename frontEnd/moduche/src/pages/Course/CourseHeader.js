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
                {periodStart && periodEnd
                  ? `${periodStart} → ${periodEnd}`
                  : "기간 정보 없음"}
              </Typography>

              <Clock className="icon" />
              <Typography color="text.secondary" sx={{ fontSize: "1.4rem" }}>
                {scheduleLine ?? "일정 정보 없음"}
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <Divider />
        {/* 회차 선택 (기존 그대로) */}
        ...
        <Divider />
        {showMeta && (
          <>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Tags
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {(tags.length ? tags : ["태그 없음"]).map((t) => (
                  <Chip key={t} label={t} variant="outlined" size="small" />
                ))}
              </Stack>
            </Box>

            <Divider />

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "inline-flex", gap: 0.5 }}
            >
              <MapPin size={16} /> {locationText ?? "장소 정보 없음"}
            </Typography>
          </>
        )}
      </Box>
    </SectionBox>
  );
}
