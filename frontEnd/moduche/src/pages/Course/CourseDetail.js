// src/pages/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { Box, Toolbar, Container } from "@mui/material";
import Layout from "../../component/common/Layout";
import CourseImage from "./CourseImage";
import CourseHeader from "./CourseHeader";
import CourseDescription from "./CourseDescription";
import QuickSearchBar from "./QuickSearchBar";
import CourseSidebar from "./CourseSidebar";

// ★ API 클라이언트
import { getCourseHeader } from "../../api/courseAPI"; // 앞서 만든 함수
import { mapHeaderToProps } from "../../api/coursemappers/courseMapper"; // 선택: 매퍼 사용 시

// (예) 라우터에서 코스 ID 받는다고 가정
export default function CourseDetail({ courseId = "1" }) {
  const [loading, setLoading] = useState(true);
  const [ui, setUi] = useState(null); // 헤더/사이드바에 뿌릴 UI 데이터 묶음
  const [sessionId, setSessionId] = useState("");
  const [date, setDate] = useState("");
  const [spotsLeft, setSpotsLeft] = useState(0);

  // 1) 서버에서 헤더 데이터 가져오기
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getCourseHeader(courseId);
        if (!alive) return;

        // 매퍼로 UI-friendly 구조 변환
        const mapped = mapHeaderToProps(data); // title/byline/period/sessions/dates...
        setUi(mapped);

        // 2) 기본 선택값 주입
        const sid = mapped.defaultSessionId || mapped.sessions?.[0]?.id || "";
        const first = (sid && mapped.datesBySession[sid]?.[0]) || "";
        setSessionId(sid);
        setDate(first);

        // 3) 사이드바 잔여좌석 (없으면 0)
        //   - 서버 remaining이 세션별이면 sid 바뀔 때 업데이트하는 쪽이 더 정확함.
        const remainForSid =
          mapped.sessions?.find((s) => s.id === sid)?.remaining ?? 0;
        setSpotsLeft(remainForSid);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [courseId]);

  // 세션 변경 시 사이드바 남은 좌석 갱신 (세션별 remaining을 쓴다고 가정)
  useEffect(() => {
    if (!ui || !sessionId) return;
    const r = ui.sessions?.find((s) => s.id === sessionId)?.remaining ?? 0;
    setSpotsLeft(r);
    // 날짜 기본값도 세션 바뀌면 첫 번째로
    const first = ui.datesBySession?.[sessionId]?.[0] || "";
    if (first) setDate(first);
  }, [sessionId, ui]);

  if (loading || !ui) {
    return (
      <Layout>
        <Toolbar />
        <Container maxWidth="xl">
          <div>로딩중…</div>
        </Container>
      </Layout>
    );
  }

  const hasImage = true;
  const hasHeader = true;
  const hasDetail = true;
  const hasSidebar = true;

  return (
    <Layout>
      <Toolbar />

      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, md: 3 },
          py: 3,
          minHeight: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <QuickSearchBar />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3,
            alignItems: "stretch",
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* 좌측 메인 */}
          <Box
            sx={{
              flex: { lg: 3 },
              display: "flex",
              flexDirection: "column",
              gap: 3,
              minWidth: 0,
              minHeight: 0,
            }}
          >
            {/* 상단: 이미지 | 헤더 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}
            >
              <Box sx={{ flex: { md: 1 }, minWidth: 0 }}>
                <CourseImage
                  hasImage={hasImage}
                  src={
                    ui.thumbnailUrl ||
                    "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop"
                  }
                />
              </Box>

              <Box sx={{ flex: { md: 1 }, minWidth: 0 }}>
                <CourseHeader
                  hasHeader={hasHeader}
                  sessions={ui.sessions}
                  datesBySession={ui.datesBySession}
                  sessionId={sessionId}
                  setSessionId={setSessionId}
                  date={date}
                  setDate={setDate}
                  showMeta={false}
                  emphasizeByline={true}
                  // 서버 데이터 바인딩
                  titleText={ui.titleText}
                  bylineName={ui.bylineName}
                  bylineOrg={ui.bylineOrg}
                  periodStart={ui.periodStart}
                  periodEnd={ui.periodEnd}
                  scheduleLine={ui.scheduleLine}
                  tags={ui.tags}
                  locationText={ui.locationText}
                />
              </Box>
            </Box>

            {/* 상세 */}
            <Box sx={{ flex: 1, minHeight: 240, display: "flex" }}>
              <Box sx={{ flex: 1 }}>
                <CourseDescription hasDetail={hasDetail} />
                {/* 필요하면 CourseDescription에도 서버 description/tags/address 주입 */}
              </Box>
            </Box>
          </Box>

          {/* 우측 사이드바 */}
          <Box
            sx={{
              flex: { lg: 1 },
              minWidth: { lg: 320 },
              position: { lg: "sticky" },
              top: { lg: 88 },
              alignSelf: { lg: "flex-start" },
            }}
          >
            <CourseSidebar
              hasSidebar={hasSidebar}
              spotsLeft={spotsLeft}
              sessions={ui.sessions}
              sessionId={sessionId}
              date={date}
            />
          </Box>
        </Box>
      </Container>
    </Layout>
  );
}
