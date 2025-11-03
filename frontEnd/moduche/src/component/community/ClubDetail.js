import React, { useMemo } from "react";
import { Box, Toolbar, Container } from "@mui/material";
import Layout from "../../component/common/Layout";
import CourseImage from "../Course/CourseImage"; // 이미지 컴포넌트 재사용
import QuickSearchBar from "../Course/QuickSearchBar";
import ClubHeader from "./ClubHeader"; // 새로 만든 컴포넌트
import ClubSidebar from "./ClubSidebar";
import ClubDescription from "./ClubDescription";

export default function ClubDetail() {
  // 동호회 상세 페이지를 위한 Mock 데이터
  const clubData = useMemo(
    () => ({
      name: "모두의 달리기 클럽",
      founder: "김철수",
      location: "서울숲 공원",
      schedule: "매주 토요일 오전 9시",
      memberCount: 24,
      capacity: 50,
      tags: ["달리기", "초보 환영", "아침 운동", "서울숲", "건강"],
      coverImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
    }),
    []
  );

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
          minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <QuickSearchBar />
        </Box>

        {/* --- Flexbox 기반 레이아웃 --- */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3,
            alignItems: "stretch",
            flex: 1, // 남은 세로 공간 채우기
            minHeight: 0,
          }}
        >
          {/* 1. 좌측 메인 콘텐츠 (flex: 3) */}
          <Box
            sx={{
              flex: { lg: 3 },
              display: "flex",
              flexDirection: "column",
              gap: 3,
              minWidth: 0,
            }}
          >
            {/* 1-1. 상단 카드 영역 (이미지 + 헤더) */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
              {/* 이미지 영역 */}
              <Box sx={{ flex: { md: 1 }, minWidth: 0 }}>
                <CourseImage hasImage={hasImage} src={clubData.coverImage} />
              </Box>

              {/* 헤더 영역 */}
              <Box sx={{ flex: { md: 1 }, minWidth: 0 }}>
                <ClubHeader hasHeader={hasHeader} clubData={clubData} />
              </Box>
            </Box>

            {/* 1-2. 하단 상세 설명 */}
            <ClubDescription hasDetail={hasDetail} clubData={clubData} />
          </Box>

          {/* 2. 우측 사이드바 (flex: 1) */}
          <Box
            sx={{
              flex: { lg: 1 },
              minWidth: { lg: 320 },
            }}
          >
            <ClubSidebar
              hasSidebar={hasSidebar}
              clubData={clubData}
            />
          </Box>
        </Box>
      </Container>
    </Layout>
  );
}
