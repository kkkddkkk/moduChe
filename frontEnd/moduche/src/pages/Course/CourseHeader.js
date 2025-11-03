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
}) {
  if (!hasHeader) {
    return <SectionBox label="헤더 정보" />;
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
            Adaptive Pilates — Core Strength for All
          </Typography>

          {/* byline 크기/가중치 제어 */}
          <Typography
            variant={emphasizeByline ? "body1" : "body2"}
            color="text.secondary"
            sx={{ fontWeight: emphasizeByline ? 600 : 400 }}
          >
            by <b>Jamie Park</b> · Navi Athletics Club
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            pt={1}
            alignItems="flex-start"
          >
            {/* 날짜 */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "24px 1fr", // ← 왼쪽 아이콘 고정폭, 오른쪽 텍스트
                rowGap: 0.5,
                columnGap: 1,
                alignItems: "center",
                // 아이콘 공통 스타일 (전역 css 영향 차단)
                "& .icon": {
                  width: 20,
                  height: 20,
                  display: "block",
                  fill: "none",
                  stroke: "currentColor",
                  flexShrink: 0,
                },
              }}
            >
              {/* 1행: 캘린더 */}
              <Calendar className="icon" />
              <Typography
                component="span"
                color="text.secondary"
                sx={{ fontSize: "1.4rem", lineHeight: 1.45 }}
              >
                2025-11-01 → 2026-01-31
              </Typography>

              {/* 2행: 시계 */}
              <Clock className="icon" />
              <Typography
                component="span"
                color="text.secondary"
                sx={{ fontSize: "1.4rem", lineHeight: 1.45 }}
              >
                Weekly • Tue/Thu • 8 Sessions / 4 Weeks
              </Typography>
            </Box>
          </Stack>
        </Stack>

        <Divider />

        {/* 회차/날짜 선택 */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Session Block
            </Typography>
            <StandardSelect
              padding={12}
              size={18}
              data={sessions.map((s) => s.id)}
              format={(id) => {
                const s = sessions.find((x) => x.id === id);
                return s ? `${s.label} (left ${s.remaining})` : id;
              }}
              selected={sessionId}
              setSelected={(v) => {
                setSessionId(v);
                setDate(datesBySession[v][0]);
              }}
              placeholder="Session Block"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Pick a Date/Time
            </Typography>
            <StandardSelect
              padding={12}
              size={18}
              data={datesBySession[sessionId] || []}
              format={(d) => d}
              selected={date}
              setSelected={setDate}
              placeholder="Pick a Date/Time"
            />
          </Grid>
        </Grid>

        <Divider />

        {/* ⬇️ 메타(태그/주소): showMeta가 true일 때만 헤더에서 표시 */}
        {showMeta && (
          <>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Tags
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {["시각", "청각", "지체", "보조인 가능", "수어 통역"].map(
                  (t) => (
                    <Chip key={t} label={t} variant="outlined" size="small" />
                  )
                )}
              </Stack>
            </Box>

            <Divider />

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
            >
              <MapPin size={16} /> Gangnam Navi Center, Rm 302
            </Typography>
          </>
        )}
      </Box>
    </SectionBox>
  );
}
