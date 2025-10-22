import React, { useMemo, useState } from "react";
import { Box, Grid, Toolbar } from "@mui/material";
import Layout from "../../component/common/Layout";
import CourseImage from "./CourseImage";
import CourseHeader from "./CourseHeader";
import CourseSidebar from "./CourseSidebar";
import CourseDescription from "./CourseDescription";
import QuickSearchBar from "./QuickSearchBar"; // 경로 확인

export default function CourseDetail() {
  // ── Data & State ───────────────────────────────────────────────────────────
  // 실제로는 API 호출 등을 통해 데이터를 가져옵니다.
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
  
  // 실제 데이터 유무를 바꿔 보며 레이아웃 유지 확인 가능
  const hasImage = true;
  const hasHeader = true;
  const hasSidebar = true;
  const hasDetail = true;

  return (
    <Layout>
      <Toolbar />

      {/* 전체 레이아웃: 24컬럼 = 좌여백3 : 본문18 : 우여백3 */}
      <Grid container columns={24} justifyContent="center" sx={{ px: { xs: 2, lg: 3 }, py: 3 }}>
        {/* 좌 여백 */}
        <Grid item lg={3} sx={{ display: { xs: "none", lg: "block" } }} />

        {/* 중앙 본문 (18컬럼) */}
        <Grid item xs={24} lg={18}>
          {/* 퀵 서치 영역 */}
          <Box sx={{ mb: 3 }}>
            <QuickSearchBar />
          </Box>

          {/* 본문 내부: 15컬럼 = [이미지+헤더](9) : [사이드바](6) */}
          <Grid container spacing={3} alignItems="stretch">
            {/* 이미지: md(태블릿) 이상에서는 6칸, lg(데스크탑)에서는 4.5칸 */}
            <Grid item xs={12} md={6} lg={4.5} sx={{ display: "flex" }}>
              <CourseImage hasImage={hasImage} />
            </Grid>

            {/* 헤더 정보: md(태블릿) 이상에서는 6칸, lg(데스크탑)에서는 4.5칸 */}
            <Grid item xs={12} md={6} lg={4.5} sx={{ display: "flex" }}>
              <CourseHeader
                hasHeader={hasHeader}
                sessions={sessions}
                datesBySession={datesBySession}
                sessionId={sessionId}
                setSessionId={setSessionId}
                date={date}
                setDate={setDate}
              />
            </Grid>

            {/* 사이드바: lg(데스크탑)에서는 3칸, 그 이하에서는 전체 너비 */}
            <Grid item xs={12} lg={3} sx={{ display: "flex" }}>
              <CourseSidebar
                hasSidebar={hasSidebar}
                spotsLeft={spotsLeft}
                sessions={sessions}
                sessionId={sessionId}
                date={date}
              />
            </Grid>

            {/* 하단 상세 내용: lg(데스크탑)에서는 9칸, 그 이하에서는 전체 너비 */}
            <Grid item xs={12} lg={9} sx={{ display: "flex" }}>
              <CourseDescription hasDetail={hasDetail} />
            </Grid>
          </Grid>
        </Grid>

        {/* 우 여백 */}
        <Grid item lg={3} sx={{ display: { xs: "none", lg: "block" } }} />
      </Grid>
    </Layout>
  );
}
