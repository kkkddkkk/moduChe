import {
    Box,
    Grid,
    Paper,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { CenterTitle, SmallerSubTitle, SubTitle } from "../common/Text";
import { TwoAlignedButtons } from "../common/Button";
import PostAreaComponent from "./PostAreaComponent";
import { useEffect, useState } from "react";
import { SideBannerSmall } from "../common/SideBanner";
import QuickSearchBar from "../../pages/Course/QuickSearchBar";
import HomeHeader from "./HomeHeader";

const HomeComponent = ({ posts, totalPages, page, setPage }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    let sideSize, centerSize;
    if (isMobile) {
        sideSize = 0;
        centerSize = 12;
    } else if (isTablet) {
        sideSize = 1;
        centerSize = 10;
    } else {
        sideSize = 1.5;
        centerSize = 9;
    }

    return (
        <Box
            sx={{
                backgroundColor: "#F8FAFC",
                pb: 6,
                width: "100%", // 전체 폭 사용
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // 내부 가운데 정렬
            }}
        >
            <Grid size={12}>
                <HomeHeader />
            </Grid>
            <Grid size={12} sx={{ m: 2, mt: 0, mb: 3 }}>
                <QuickSearchBar />
            </Grid>

            <Grid size={sideSize} />
            <Grid size={centerSize}>
                <PostAreaComponent
                    posts={posts}
                    totalPages={totalPages}
                    page={page}
                    setPage={setPage}
                />
            </Grid>
            <Grid size={sideSize} />

            <SideBannerSmall
                adImage={
                    "https://moduche-bucket.s3.ap-northeast-2.amazonaws.com/banners/side-banners/side_1.png"
                }
                clickURL={"https://namu.wiki/w/%ED%96%84%EC%8A%A4%ED%84%B0"}
                position="left"
            />
        </Box>
    );
};
export default HomeComponent;
