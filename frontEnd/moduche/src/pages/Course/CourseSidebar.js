// CourseSidebar.jsx
import { Box, Grid, Typography } from "@mui/material";
import { Users } from "lucide-react";
import { OneAlignedButton } from "../../component/common/Button";
import Paper from "../../component/common/Paper";
import SectionBox from "./SectionBox";
import { StandardSelect } from "../../component/common/CustomSelect";

export default function CourseSidebar({
  hasSidebar,
  sessions = [],
  datesBySession = {},
  sessionId,
  setSessionId,
  date,
  setDate,

  spotsLeft,
  price,
  capacity,
  refundPolicy = "첫 수업 24시간 전 100% 환불",
  onEnroll,
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

  const selected = sessions?.find((s) => s.id === sessionId) ?? null;

  const remaining =
    typeof spotsLeft === "number"
      ? spotsLeft
      : typeof selected?.remaining === "number"
      ? selected.remaining
      : undefined;

  const enrolled =
    typeof capacity === "number" && typeof remaining === "number"
      ? Math.max(0, capacity - remaining)
      : undefined;

  const capacityLine =
    typeof capacity === "number" && typeof enrolled === "number"
      ? `${enrolled}/${capacity}`
      : typeof capacity === "number"
      ? `0/${capacity}`
      : "—";

  const spotsLeftLine =
    typeof remaining === "number"
      ? remaining > 0
        ? `잔여 ${remaining}석`
        : "마감"
      : "좌석 정보 없음";

  const priceLine =
    typeof price === "number"
      ? `${price.toLocaleString()} KRW`
      : typeof price === "string"
      ? price
      : null;

  /* ---------- 세션/날짜 셀렉트용 옵션 ---------- */

  // 날짜 포맷 간단히 YYYY.MM.DD 로 바꾸는 헬퍼
  const formatDate = (iso) => {
    if (!iso) return "";
    return iso.replaceAll("-", ".");
  };

  // interval → "매주"/"격주"/"매월"
  const intervalToText = (interval) => {
    if (!interval || interval === 1) return "매주";
    if (interval === 2) return "격주";
    if (interval === 4) return "매월";
    return "매주";
  };

  // dowMask → "월수목" 형식
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

  // ✅ 세션 옵션: value = "S1" / label = "1회차 · 2025.11.29 ~ 2025.11.30 · 매주 월수금 18:00 ~ 20:30"
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

      return {
        value: s.id,
        label,
      };
    }) ?? [];

  // 날짜 옵션 (지금은 백엔드에서 "Nov 03 18:00" 형식으로 주니까 그대로 씀)
  const dateOptions =
    (datesBySession?.[sessionId] ?? []).map((d) => ({
      value: d,
      label: d,
    })) ?? [];

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

  const handleEnroll = () => {
    if (onEnroll) {
      onEnroll({
        sessionId,
        date,
      });
    }
  };

  const isSoldOut =
    typeof remaining === "number" &&
    Number.isFinite(remaining) &&
    remaining <= 0;

  // ✅ StandardSelect 가 기대하는 selected 형태: data 안에 있는 객체

  const currentSession = sessions?.find((s) => s.id === sessionId) ?? null;

  const selectedSessionOption =
    sessionOptions.find((opt) => opt.value === sessionId) ?? "";

  const selectedDateOption =
    dateOptions.find((opt) => opt.value === date) ?? "";

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
            gap: 3,
            minHeight: { xs: 380, md: 460 },
          }}
        >
          {/* 상단 가격/정원 요약 */}
          <Grid
            container
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Grid item>
              {priceLine && (
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ fontSize: "1.8rem" }}
                >
                  {priceLine}
                </Typography>
              )}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.9rem" }}
              >
                {refundPolicy}
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
                  fontSize: "1rem",
                }}
              >
                <Users style={{ width: 16, height: 16 }} /> {capacityLine}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: isSoldOut
                    ? "error.main"
                    : typeof remaining === "number"
                    ? "success.main"
                    : "text.secondary",
                  fontWeight: 600,
                  display: "block",
                  mt: 0.5,
                  fontSize: "0.95rem",
                }}
              >
                {spotsLeftLine}
              </Typography>
            </Grid>
          </Grid>

          {/* 🔹 세션 / 날짜 선택 카드 */}
          <Paper
            sx={{
              m: 0,
              p: 2.5,
              borderRadius: 2,
              bgcolor: "grey.50",
              mt: 0.5,
              mb: 1.0,
            }}
          >
            {/* Session Select */}
            <Grid container alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "0.95rem" }}
                >
                  Session
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <StandardSelect
                  padding={8}
                  size={14}
                  data={sessionOptions}
                  format={(opt) =>
                    typeof opt === "object" ? opt.label : String(opt ?? "")
                  }
                  selected={selectedSessionOption}
                  setSelected={handleSessionSelect}
                  placeholder="회차 선택"
                  // ✅ 닫힌 상태에서도 label 로 보여주기
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
              </Grid>
            </Grid>

            {/* Date Select */}
            <Grid container alignItems="center">
              <Grid item xs={4}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "0.95rem" }}
                >
                  Date
                </Typography>
              </Grid>
              <Grid item xs={8}>
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
                  // 🔥 여기서 'Dec 01 18:00' 대신 기간으로 보여줌
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
              </Grid>
            </Grid>
          </Paper>

          {/* 수강신청 버튼 + 안내문 */}
          <Box>
            <OneAlignedButton
              size="large"
              onClick={handleEnroll}
              disabled={!sessionId || !date || isSoldOut}
              buttonSx={{ width: "100%", py: 1.3, fontWeight: 600 }}
              buttonWrapperSx={{ width: "100%" }}
            >
              {!sessionId || !date
                ? "회차/날짜를 선택해주세요"
                : isSoldOut
                ? "마감"
                : "수강 신청"}
            </OneAlignedButton>

            <Typography
              variant="caption"
              color="text.secondary"
              component="p"
              sx={{
                mt: 2,
                textAlign: "center",
                fontSize: "0.85rem",
                lineHeight: 1.45,
              }}
            >
              신청 시 환불 및 운영 정책에 동의하게 됩니다.
            </Typography>
          </Box>
        </Box>
      </SectionBox>
    </Box>
  );
}
