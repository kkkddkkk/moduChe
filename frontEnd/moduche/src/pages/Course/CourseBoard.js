import { useState } from "react";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import { CenterTitle } from "../../component/common/Text";
import { SideBannerSmall } from "../../component/common/SideBanner";
import QuickSearchBar from "../../component/common/QuickSearchBar";
import CourseListArea from "./CourseListArea";

const CourseBoardHome = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 🔹 검색 결과 상태
  const [searchItems, setSearchItems] = useState(null); // null이면 "검색 안 됨" 상태
  const [total, setTotal] = useState(0);

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
      <SideBannerSmall
        adImage="https://moduche-bucket.s3.ap-northeast-2.amazonaws.com/banners/side-banners/side_1.png"
        clickURL="https://namu.wiki/w/%ED%96%84%EC%8A%A4%ED%84%B0"
        position="left"
      />

      <Grid size={sideSize} />
      <Grid size={centerSize}>
        {/* 상단 타이틀 */}
        <Box sx={{ mb: 2 }}>
          <CenterTitle>강좌 게시판</CenterTitle>
        </Box>

        {/* 🔍 퀵 검색바: onResult로 결과 받기 */}
        <Box sx={{ mb: 3 }}>
          <QuickSearchBar
            boardType="COURSE"
            onResult={(items, totalCount, payload, raw) => {
              console.log("🔍 검색 결과 items:", items);
              console.log("🔍 검색 total:", totalCount);
              setSearchItems(items);
              setTotal(totalCount);
            }}
          />
        </Box>

        {/* ✅ 검색 결과 있으면 그걸, 없으면 기본 리스트 */}
        <CourseListArea items={searchItems} total={total} />
      </Grid>
      <Grid size={sideSize} />
    </>
  );
};

export default CourseBoardHome;
