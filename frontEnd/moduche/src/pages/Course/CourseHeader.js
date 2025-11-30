// CourseHeader.jsx
import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import { Calendar, Clock, MapPin } from "lucide-react";
import Paper from "../../component/common/Paper";
import { StandardSelect } from "../../component/common/CustomSelect";

export default function CourseHeader({
  hasHeader,
  sessions = [],
  datesBySession = {},
  sessionId,
  setSessionId,
  date,
  setDate,
  showMeta = false,
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
  if (!hasHeader) {
    return (
      <Paper
        sx={{
          p: 3,
          height: "100%", // 🔥 행 높이 꽉 채우기
          minHeight: { xs: 200, lg: 320 }, // 이미지 카드와 비슷한 최소 높이
        }}
      >
        <Typography variant="body2" color="text.secondary">
          헤더 영역
        </Typography>
      </Paper>
    );
  }

  // 🔁 사이드바와 같은 포맷 사용
  const formatDate = (iso) => (iso ? iso.replaceAll("-", ".") : "");
  const intervalToText = (interval) => {
    if (!interval || interval === 1) return "매주";
    if (interval === 2) return "격주";
    if (interval === 4) return "매월";
    return "매주";
  };
  const dowMaskToKorean = (mask) => {
    if (!mask) return "";
    const labels = ["월", "화", "수", "목", "금", "토", "일"];
    const m = mask.padEnd(7, "0");
    let out = "";
    for (let i = 0; i < 7; i++) {
      if (m[i] === "1") out += labels[i];
    }
    return out;
  };

  const sessionOptions =
    sessions?.map((s, idx) => {
      const no = idx + 1;
      const range =
        s.startDate && s.endDate
          ? `${formatDate(s.startDate)} ~ ${formatDate(s.endDate)}`
          : "";
      const freq = intervalToText(s.interval);
      const days = dowMaskToKorean(s.dowMask);
      const time =
        s.startTime && s.endTime ? `${s.startTime} ~ ${s.endTime}` : "";

      const detailParts = [];
      if (range) detailParts.push(range);
      if (freq || days || time) {
        detailParts.push(
          [freq, days, time].filter((x) => x && x.length > 0).join(" ")
        );
      }

      const label =
        detailParts.length > 0
          ? `${no}회차 · ${detailParts.join(" · ")}`
          : `${no}회차`;

      return { value: s.id, label };
    }) ?? [];

  const dateOptions =
    (datesBySession?.[sessionId] ?? []).map((d) => ({
      value: d,
      label: d,
    })) ?? [];

  const currentSession = sessions?.find((s) => s.id === sessionId) ?? null;

  const selectedSessionOption =
    sessionOptions.find((opt) => opt.value === sessionId) ?? "";
  const selectedDateOption =
    dateOptions.find((opt) => opt.value === date) ?? "";

  const handleSessionSelect = (optOrVal) => {
    if (!optOrVal) {
      setSessionId?.("");
      setDate?.("");
      return;
    }
    const newId =
      typeof optOrVal === "object" && optOrVal !== null
        ? optOrVal.value
        : optOrVal;
    setSessionId?.(newId);
    const first = datesBySession?.[newId]?.[0] || "";
    setDate?.(first);
  };

  const handleDateSelect = (optOrVal) => {
    if (!optOrVal) {
      setDate?.("");
      return;
    }
    const newDate =
      typeof optOrVal === "object" && optOrVal !== null
        ? optOrVal.value
        : optOrVal;
    setDate?.(newDate);
  };

  const formatPeriod = () => {
    if (!periodStart || !periodEnd) return null;
    return `${periodStart} ~ ${periodEnd}`;
  };

  return (
    <Paper
      sx={{
        // SectionBox + 안쪽 Box 조합과 느낌 비슷하게
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        minHeight: 400, // ✅ ClubHeader랑 맞춤
      }}
    >
      {/* 🔥 py를 Paper가 아닌 내부 Box에 적용하여 높이 정렬 맞춤 */}
      <Box
        sx={{
          px: 3,
          py: 2, // ✅ ClubHeader 안쪽 Box와 동일
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
          gap: 2,
        }}
      >
        {/* 제목 */}
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ mb: 0.5, wordBreak: "keep-all" }}
        >
          {titleText || "Untitled Course"}
        </Typography>

        {/* 강사 / 기관 */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontWeight: emphasizeByline ? 600 : 400,
            mb: 1,
          }}
        >
          {bylineName && <span>{bylineName}</span>}
          {bylineOrg && (
            <span style={{ marginLeft: 8, color: "#777" }}>· {bylineOrg}</span>
          )}
        </Typography>

        {/* 메타 정보 */}
        {showMeta && (
          <Stack direction="column" spacing={0.5} sx={{ mb: 1 }}>
            {formatPeriod() && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <Calendar size={16} />
                {formatPeriod()}
              </Typography>
            )}

            {scheduleLine && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <Clock size={16} />
                {scheduleLine}
              </Typography>
            )}

            {locationText && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <MapPin size={16} />
                {locationText}
              </Typography>
            )}
          </Stack>
        )}

        {/* 태그 */}
        {tags && tags.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
            {tags.map((t, idx) => (
              <Chip
                key={idx}
                size="small"
                label={t}
                color="primary"
                sx={{ fontSize: "0.8rem" }}
              />
            ))}
          </Stack>
        )}

        <Divider sx={{ my: 2 }} />

        {/* 🔥 세션/날짜 선택 영역 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            mt: "auto", // 남는 공간 위로 밀고, select 영역은 아래쪽에 고정 느낌
          }}
        >
          {/* Session 선택 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ minWidth: 60 }}
            >
              Session
            </Typography>
            <Box sx={{ flex: 1 }}>
              <StandardSelect
                padding={8}
                size={14}
                data={sessionOptions}
                format={(opt) =>
                  typeof opt === "object" ? opt.label : String(opt ?? "")
                }
                selected={selectedSessionOption}
                setSelected={handleSessionSelect}
                placeholder={"회차 선택"}
                disabled={sessionOptions.length === 0}
                renderValue={(value) => {
                  const opt =
                    sessionOptions.find((o) => o.value === value) ?? null;
                  return (
                    <span style={{ color: opt ? "black" : "gray" }}>
                      {opt ? opt.label : "회차 선택"}
                    </span>
                  );
                }}
              />
            </Box>
          </Box>

          {/* Date 선택 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ minWidth: 60 }}
            >
              Date
            </Typography>
            <Box sx={{ flex: 1 }}>
              <StandardSelect
                padding={8}
                size={14}
                data={dateOptions}
                format={(opt) =>
                  typeof opt === "object" ? opt.label : String(opt ?? "")
                }
                selected={selectedDateOption}
                setSelected={handleDateSelect}
                placeholder={
                  sessionId ? "날짜 선택" : "먼저 회차를 선택해주세요"
                }
                disabled={!sessionId || dateOptions.length === 0}
                renderValue={(value) => {
                  if (currentSession?.startDate && currentSession?.endDate) {
                    const start = formatDate(currentSession.startDate);
                    const end = formatDate(currentSession.endDate);
                    return (
                      <span style={{ color: "black" }}>
                        {start} ~ {end}
                      </span>
                    );
                  }

                  const opt =
                    dateOptions.find((o) => o.value === value) ?? null;
                  return (
                    <span style={{ color: opt ? "black" : "gray" }}>
                      {opt ? opt.label : "날짜 선택"}
                    </span>
                  );
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
