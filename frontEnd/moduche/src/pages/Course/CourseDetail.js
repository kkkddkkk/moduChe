// src/pages/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { Box, Toolbar, Container } from "@mui/material";
import Layout from "../../component/common/Layout";
import CourseImage from "./CourseImage";
import CourseHeader from "./CourseHeader";
import CourseDescription from "./CourseDescription";
import QuickSearchBar from "./QuickSearchBar";
import CourseSidebar from "./CourseSidebar";

// API 클라이언트
import { getCourseHeader } from "../../api/courseAPI";
import { mapHeaderToProps } from "../../api/coursemappers/courseMapper";

export default function CourseDetail({ courseId = "4" }) {
  const [loading, setLoading] = useState(true);
  const [ui, setUi] = useState(null);
  const [error, setError] = useState(null);

  const [sessionId, setSessionId] = useState("");
  const [date, setDate] = useState("");
  const [spotsLeft, setSpotsLeft] = useState(0);

  /** 1) 서버에서 헤더 데이터 가져오기 */
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setError(null);
        setLoading(true);

        console.log("📡 [CourseDetail] 요청 courseId =", courseId);

        const data = await getCourseHeader(courseId);
        console.log("📨 [CourseDetail] 서버 응답 =", data);

        if (!alive) return;

        const mapped = mapHeaderToProps(data);
        console.log("🎨 [CourseDetail] mapped UI =", mapped);

        setUi(mapped);

        /** 기본값 처리 */
        const sid = mapped.defaultSessionId || mapped.sessions?.[0]?.id || "";
        const first = (sid && mapped.datesBySession[sid]?.[0]) || "";

        setSessionId(sid);
        setDate(first);

        const remainForSid =
          mapped.sessions?.find((s) => s.id === sid)?.remaining ?? 0;
        setSpotsLeft(remainForSid);
      } catch (e) {
        console.error("❌ [CourseDetail] 헤더 로드 실패:", e);
        if (alive) setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [courseId]);

  /** 2) 세션 변경 시 좌석/날짜 갱신 */
  useEffect(() => {
    if (!ui || !sessionId) return;

    const r = ui.sessions?.find((s) => s.id === sessionId)?.remaining ?? 0;
    setSpotsLeft(r);

    const first = ui.datesBySession?.[sessionId]?.[0] || "";
    if (first) setDate(first);
  }, [sessionId, ui]);

  /** ====================
   *  렌더링 분기 처리
   * ==================== */

  /** 로딩 상태 */
  if (loading) {
    return (
      <Layout>
        <Toolbar />
        <Container maxWidth="xl">
          <div style={{ padding: 20 }}>로딩중…</div>
        </Container>
      </Layout>
    );
  }

  /** 에러 상태 */
  if (error) {
    return (
      <Layout>
        <Toolbar />
        <Container maxWidth="xl">
          <h2>강좌 정보를 불러오지 못했습니다.</h2>
          <pre style={{ whiteSpace: "pre-wrap", color: "red" }}>
            {String(error.message || error)}
          </pre>
        </Container>
      </Layout>
    );
  }

  /** 데이터 없음 */
  if (!ui) {
    return (
      <Layout>
        <Toolbar />
        <Container maxWidth="xl">
          <h2>강좌 데이터가 없습니다.</h2>
        </Container>
      </Layout>
    );
  }

  /** 정상 렌더링 */
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
            {/* 이미지 + 헤더 영역 */}
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
                  /* 백엔드 데이터 */
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

            {/* 상세 설명 */}
            <Box sx={{ flex: 1, minHeight: 240, display: "flex" }}>
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
