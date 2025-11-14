// CourseSidebar.jsx
import { Box, Grid, Typography } from "@mui/material";
import { Users } from "lucide-react";
import { OneAlignedButton } from "../../component/common/Button";
import Paper from "../../component/common/Paper";
import SectionBox from "./SectionBox";

/**
 * 서버 데이터 바인딩 가이드
 * props:
 * - hasSidebar: boolean
 * - sessions: [{ id, label, remaining? }]   // ← header.sessions 그대로 사용
 * - sessionId: string
 * - date: string
 * - price?: number | string                  // 없으면 표시 안 함
 * - capacity?: number                        // header.maxParticipants 전달 권장
 * - refundPolicy?: string                    // 기본 문구 제공
 * - onEnroll?: (payload) => void             // 수강신청 클릭 시 콜백 (선택)
 */
export default function CourseSidebar({
  hasSidebar,
  sessions,
  sessionId,
  date,

  // 선택 props
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

  // 현재 선택된 세션
  const selected = sessions?.find((s) => s.id === sessionId);
  const remaining = selected?.remaining; // number | undefined

  // 정원/잔여 표기 계산
  // capacity와 remaining 둘 다 있으면 "enrolled/capacity" 계산해서 노출
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
      ? `${remaining} spots left`
      : "좌석 정보 없음";

  const priceLine =
    typeof price === "number"
      ? `${price.toLocaleString()} KRW`
      : typeof price === "string"
      ? price
      : null;

  const handleEnroll = () => {
    if (onEnroll) {
      onEnroll({
        sessionId,
        date,
      });
    }
  };

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
                  sx={{ fontSize: "2rem" }}
                >
                  {priceLine}
                </Typography>
              )}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "1rem" }}
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
                  fontSize: "2rem",
                }}
              >
                <Users style={{ width: 16, height: 16 }} /> {capacityLine}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color:
                    typeof remaining === "number" && remaining <= 3
                      ? "error.main"
                      : "success.main",
                  fontWeight: 600,
                  display: "block",
                  mt: 0.5,
                  fontSize: "1rem",
                }}
              >
                {spotsLeftLine}
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
              mb: 1.0,
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
                {selected?.label ?? "—"}
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
                {date || "—"}
              </Typography>
            </Grid>
          </Paper>

          {/* 수강신청 버튼 + 안내문 */}
          <Box>
            <OneAlignedButton
              size="large"
              onClick={handleEnroll}
              disabled={typeof remaining === "number" && remaining <= 0}
              buttonSx={{ width: "100%", py: 1.3, fontWeight: 600 }}
              buttonWrapperSx={{ width: "100%" }}
            >
              {typeof remaining === "number" && remaining <= 0
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
                fontSize: "0.95rem",
                lineHeight: 1.45,
              }}
            >
              신청 시 정책에 동의하게 됩니다.
            </Typography>
          </Box>
        </Box>
      </SectionBox>
    </Box>
  );
}
