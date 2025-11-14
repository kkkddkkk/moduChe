import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import { CenterTitle, SmallerSubTitle } from "../../component/common/Text";
import { SideBannerSmall } from "../../component/common/SideBanner";
import QuickSearchAirbnb_WidthAnim from "../../pages/Course/QuickSearchBar";
// 🔼 경로는 네 프로젝트 구조에 맞게 조정해

import CourseListArea from "./CourseListArea";

const CourseBoardHome = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  let sideSize, centerSize;
  if (isMobile) {
    sideSize = 0;
    centerSize = 12;
  } else {
    sideSize = 1.5;
    centerSize = 9;
  }

  return (
    <>
      {/* 좌측 작은 배너 */}
      <SideBannerSmall
        adImage={
          "https://moduche-bucket.s3.ap-northeast-2.amazonaws.com/banners/side-banners/side_1.png"
        }
        clickURL={"https://namu.wiki/w/%ED%96%84%EC%8A%A4%ED%84%B0"}
        position="left"
      />

      <Grid size={sideSize} />
      <Grid size={centerSize}>
        {/* 상단 타이틀 + 서브타이틀 */}
        <Box sx={{ mb: 2 }}>
          <CenterTitle>강좌 게시판</CenterTitle>
        </Box>

        {/* ✅ 에어비앤비 스타일 퀵 검색바 */}
        <Box sx={{ mb: 3 }}>
          <QuickSearchAirbnb_WidthAnim />
        </Box>

        {/* ✅ 강좌 카드 리스트 영역 */}
        <CourseListArea />
      </Grid>
      <Grid size={sideSize} />
    </>
  );
};

export default CourseBoardHome;
