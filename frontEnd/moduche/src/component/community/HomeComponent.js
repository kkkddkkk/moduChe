import { Box, Grid, Paper, useMediaQuery, useTheme } from "@mui/material";
import { CenterTitle, SmallerSubTitle, SubTitle } from "../common/Text";
import { TwoAlignedButtons } from "../common/Button";
import PostAreaComponent from "./PostAreaComponent";
import { useEffect, useState } from "react";
import { SideBannerSmall } from "../common/SideBanner";

const HomeComponent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

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
                adImage={"https://moduche-bucket.s3.ap-northeast-2.amazonaws.com/banners/side-banners/side_1.png"}
                clickURL={"https://namu.wiki/w/%ED%96%84%EC%8A%A4%ED%84%B0"}
                position="left"
            />

            <Grid size={sideSize} />
            <Grid size={centerSize}>
                <CenterTitle children={"동아리 게시판"} />
                <PostAreaComponent />
            </Grid>
            <Grid size={sideSize} />
        </>
    );
};
export default HomeComponent;
