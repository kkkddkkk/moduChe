// src/pages/Course/CourseBoardHome.jsx
import { useState } from "react";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import { CenterTitle } from "../../component/common/Text";

import QuickSearchBar from "../../component/common/QuickSearchBar";
import CourseListArea from "./CourseListArea";
import Loading from "../../component/common/Loading";
import BannerLayout from "../../component/common/BannerLayout";

const CourseBoardHome = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchItems, setSearchItems] = useState(null);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

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
      <Loading open={loading} text="강좌 목록을 불러오는 중입니다." />

      <BannerLayout useHeader useSide sidePosition="left">
        <Grid size={sideSize} />
        <Grid size={centerSize}>
          <Box sx={{ mb: 2 }}>
            <CenterTitle>강좌 게시판</CenterTitle>
          </Box>

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

          <CourseListArea
            items={searchItems}
            total={total}
            onLoadingChange={setLoading}
          />
        </Grid>
        <Grid size={sideSize} />
      </BannerLayout>
    </>
  );
};

export default CourseBoardHome;
