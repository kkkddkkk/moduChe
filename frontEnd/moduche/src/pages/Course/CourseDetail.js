import React, { useMemo, useState } from "react";
import { Box, Toolbar, Container } from "@mui/material";
import Layout from "../../component/common/Layout";
import CourseImage from "./CourseImage";
import CourseHeader from "./CourseHeader";
import CourseDescription from "./CourseDescription";
import QuickSearchBar from "./QuickSearchBar";
import CourseSidebar from "./CourseSidebar";
export default function CourseDetail() {
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

  const hasImage = true;
  const hasHeader = true;
  const hasDetail = true;
  const hasSidebar = true;

  return (
    <Layout>
      <Toolbar />

      {/* ⬇️ 화면 높이 확보: AppBar(툴바) 높이를 뺀 만큼은 최소 확보 */}
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, md: 3 },
          py: 3,
          minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' }, // 모바일/데스크탑 AppBar
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 퀵서치 */}
        <Box sx={{ mb: 3 }}>
          <QuickSearchBar />
        </Box>

        {/* 콘텐트 행: 좌 메인 + 우 사이드바 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 3,
            alignItems: 'stretch',
            flex: 1,                 // ⬅️ 남은 세로 공간을 전부 이 행이 먹음
            minHeight: 0,
          }}
        >
          {/* 좌측 메인 (이미지+헤더 + 상세) */}
          <Box
            sx={{
              flex: { lg: 3 },
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              minWidth: 0,
              minHeight: 0,
            }}
          >
            {/* 상단 카드: 이미지 | 헤더 */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: { md: 1 }, minWidth: 0 }}>
                <CourseImage
                  hasImage={hasImage}
                  src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop"
                />
              </Box>

              <Box sx={{ flex: { md: 1 }, minWidth: 0 }}>
                <CourseHeader
                  hasHeader={hasHeader}
                  sessions={sessions}
                  datesBySession={datesBySession}
                  sessionId={sessionId}
                  setSessionId={setSessionId}
                  date={date}
                  setDate={setDate}
                />
              </Box>
            </Box>

            {/* ⬇️ 상세: 남는 높이를 먹어서 푸터 위까지 채움 */}
            <Box sx={{ flex: 1, minHeight: 240, display: 'flex' }}>
              {/* CourseDescription이 카드 높이를 고정하지 않는 한, 래퍼가 커지며 하단을 채움 */}
              <Box sx={{ flex: 1 }}>
                <CourseDescription hasDetail={hasDetail} />
              </Box>
            </Box>
          </Box>

          {/* 우측 사이드바 */}
          <Box
            sx={{
              flex: { lg: 1 },
              minWidth: { lg: 320 },
              position: { lg: 'sticky' },
              top: { lg: 88 }, // 헤더 높이에 맞춰 필요하면 조정
              alignSelf: { lg: 'flex-start' },
            }}
          >
            {/* 아래 sx가 사이드바 세로 여유 + 내부 간격 */}
            <CourseSidebar
  hasSidebar={hasSidebar}
  spotsLeft={spotsLeft}
  sessions={sessions}
  sessionId={sessionId}
  date={date}
  sx={{
    p: 3,              // 카드 안쪽 패딩 ↑
    gap: 2.5,          // 섹션 사이 기본 간격 ↑
    // 블록별 미세 간격
    '& .sidebar-price': { mb: 2 },              // 가격/상단 요약
    '& .sidebar-picker': { my: 2.5, p: 2 },     // Session/Date 선택 카드
    '& .sidebar-cta': { mt: 2.5, mb: 1 },       // 버튼 영역
    '& .sidebar-footnote': { mt: 2 },           // 하단 안내문
  }}
/>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
}