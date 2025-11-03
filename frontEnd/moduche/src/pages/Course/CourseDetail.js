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
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
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
                  showMeta={false}         // ⬅️ 헤더에서 메타 숨김
                  emphasizeByline={true}   // ⬅️ by… 라인 크게
                />
              </Box>
            </Box>

            

            {/* 상세 */}
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
              sessions={sessions}
              sessionId={sessionId}
              date={date}
              sx={{
                p: 3,
                gap: 2.5,
                "& .sidebar-price": { mb: 2 },
                "& .sidebar-picker": { my: 2.5, p: 2 },
                "& .sidebar-cta": { mt: 2.5, mb: 1 },
                "& .sidebar-footnote": { mt: 2 },
              }}
            />
          </Box>
        </Box>
      </Container>
    </Layout>
  );
}