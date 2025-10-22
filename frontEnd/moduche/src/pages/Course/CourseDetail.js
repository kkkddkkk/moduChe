import React, { useMemo, useState } from "react";
import { Users, Calendar, Clock, MapPin, Search } from "lucide-react";
import { StandardSelect } from "../../component/common/CustomSelect";
import { OneAlignedButton } from "../../component/common/Button";
import {
  Grid,
  Toolbar,
  Typography,
  Box,
  Stack,
  TextField,
  InputAdornment,
  Divider,
  Chip,
} from "@mui/material";
import Paper from "../../component/common/Paper";
import Layout from "../../component/common/Layout";

/* ─────────────────────────────────────────────────────────────
 * QuickSearchBar (헤더 바로 하단)
 * 무엇/어디서/언제/접근성 4필드
 * ────────────────────────────────────────────────────────────*/
function QuickSearchBar() {
  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const [when, setWhen] = useState({ from: "", to: "" });
  const [a11y, setA11y] = useState([]);

  const a11yOptions = ["시각", "청각", "지체", "보조인", "수어 통역"];

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            size="medium"
            label="무엇을 (강좌/태그)"
            placeholder="예) 검도, 필라테스, 초급"
            value={what}
            onChange={(e) => setWhat(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            size="medium"
            label="어디서 (지역/센터)"
            placeholder="예) 강남구, ○○스포츠센터"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              fullWidth
              size="medium"
              label="시작일"
              type="date"
              value={when.from}
              onChange={(e) => setWhen((p) => ({ ...p, from: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              size="medium"
              label="종료일"
              type="date"
              value={when.to}
              onChange={(e) => setWhen((p) => ({ ...p, to: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {a11yOptions.map((t) => {
              const selected = a11y.includes(t);
              return (
                <Chip
                  key={t}
                  label={t}
                  variant={selected ? "filled" : "outlined"}
                  color={selected ? "primary" : "default"}
                  onClick={() =>
                    setA11y((prev) =>
                      prev.includes(t)
                        ? prev.filter((x) => x !== t)
                        : [...prev, t]
                    )
                  }
                  sx={{ mb: 1 }}
                />
              );
            })}
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Box textAlign="right">
            <OneAlignedButton
              size="large"
              buttonSx={{ width: { xs: "100%", sm: "auto" }, minWidth: 160 }}
              onClick={() => {
                // TODO: /search 라우팅 (querystring 구성)
                // navigate(`/search?what=${what}&where=${where}&from=${when.from}&to=${when.to}&a11y=${a11y.join(",")}`)
                console.log({ what, where, when, a11y });
              }}
            >
              검색
            </OneAlignedButton>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

/* ─────────────────────────────────────────────────────────────
 * CourseDetail (상세)
 *  레이아웃 비율: 4.5 : 4.5 : 3 → columns=24 기준 9 : 9 : 6
 * ────────────────────────────────────────────────────────────*/
export default function CourseDetail() {
  // mock data
  const sessions = useMemo(
    () => [
      { id: "S1", label: "Block A (Nov 1–30)", remaining: 6 },
      { id: "S2", label: "Block B (Dec 1–31)", remaining: 4 },
    ],
    []
  );

  const datesBySession = useMemo(
    () => ({
      S1: ["Nov 04 19:00", "Nov 07 19:00"],
      S2: ["Dec 02 19:00", "Dec 05 19:00"],
    }),
    []
  );

  const [sessionId, setSessionId] = useState(sessions[0].id);
  const [date, setDate] = useState(datesBySession[sessions[0].id][0]);
  const spotsLeft = 7;

  const headerExtras = (
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
  );

  const sidebar = (
    <Paper sx={{ p: 3, minHeight: { lg: "calc(100vh - 160px)" } }}>
      <Grid container justifyContent="space-between" alignItems="flex-start">
        <Grid item>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            120,000 KRW
          </Typography>
          <Typography variant="caption" color="text.secondary">
            첫 수업 24시간 전 100% 환불
          </Typography>
        </Grid>
        <Grid item textAlign="right">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
          >
            <Users style={{ width: 16, height: 16 }} /> 9/16
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "success.main", fontWeight: 500, display: "block" }}
          >
            {spotsLeft} spots left
          </Typography>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3, p: 2 }}>
        <Grid container justifyContent="space-between">
          <Typography variant="body2">Session</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {sessions.find((s) => s.id === sessionId)?.label}
          </Typography>
        </Grid>
        <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body2">Date</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {date}
          </Typography>
        </Grid>
      </Paper>

      <OneAlignedButton size="large" buttonSx={{ width: "100%", mt: 2 }}>
        수강 신청
      </OneAlignedButton>
      <Typography
        variant="caption"
        color="text.secondary"
        component="p"
        sx={{ mt: 1.5, textAlign: "center" }}
      >
        신청 시 정책에 동의하게 됩니다.
      </Typography>
    </Paper>
  );

  return (
    <Layout>
      <Toolbar />

      {/* 퀵서치: 헤더 하단 */}
      <Box sx={{ px: { xs: 2, md: 4 }, pt: 2 }}>
        <QuickSearchBar />
      </Box>

      {/* 메인 그리드: 9 : 9 : 6 */}
      <Grid
        container
        columns={24}
        spacing={3}
        sx={{ px: { xs: 2, md: 4 }, pb: 6 }}
      >
        {/* 좌측-이미지 (9) */}
        <Grid item xs={24} lg={9}>
          <Paper
            sx={{
              overflow: "hidden",
              height: { xs: 240, md: "100%" },
              minHeight: 360,
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop"
              alt="cover"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Paper>
        </Grid>

        {/* 중앙-정보 (9) */}
        <Grid item xs={24} lg={9}>
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Stack spacing={1}>
              <Typography variant="h5" component="h1" fontWeight="bold">
                Adaptive Pilates — Core Strength for All
              </Typography>
              <Typography variant="body2" color="text.secondary">
                by <span style={{ fontWeight: 500 }}>Jamie Park</span> • Navi
                Athletics Club
              </Typography>
              <Stack direction="row" spacing={2} pt={1} flexWrap="wrap">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <Calendar size={16} /> 2025-11-01 → 2026-01-31
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <Clock size={16} /> Weekly • Tue/Thu • 8 Sessions / 4 Weeks
                </Typography>
              </Stack>
            </Stack>

            {headerExtras}

            {/* 태그 */}
            <Box>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
                mb={1}
              >
                Tags
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {["시각", "청각", "지체", "보조인 가능", "수어 통역"].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-gray-700 bg-white/60"
                  >
                    {t}
                  </span>
                ))}
              </Stack>
            </Box>

            {/* 장소 */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
              >
                <MapPin size={16} /> Gangnam Navi Center, Rm 302
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* 오른쪽-사이드바 (6) */}
        <Grid item xs={24} lg={6}>
          <Box sx={{ position: { lg: "sticky" }, top: { lg: 24 } }}>
            {sidebar}
          </Box>
        </Grid>

        {/* Description: 좌측(이미지+정보) 아래 전체폭 (9+9 = 18) */}
        <Grid item xs={24} lg={18}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Box className="prose max-w-none">
              <Typography variant="h6" gutterBottom>
                About the Course
              </Typography>
              <Typography variant="body1" paragraph>
                This adaptive Pilates series focuses on safe, progressive core
                work.
              </Typography>
              <Typography variant="h6" gutterBottom>
                Overview
              </Typography>
              <Typography variant="body1" paragraph>
                Build stability and mobility tailored to individual needs with
                options for various accessibility profiles.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
