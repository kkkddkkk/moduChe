import { useState } from "react";
import { Box, Tabs, Tab, Grid, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CommunityEnrollmentsManage from "../../component/community/CommunityEnrollmentsManage";
import CommunityMemberManage from "../../component/community/CommunityMemberManage";
import CommunityPostManage from "../../component/community/CommunityPostManage";
import { CenterTitle } from "../../component/common/Text";

const CommunityManagePage = () => {
    const [tab, setTab] = useState(0);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

    const commonTabStyle = (isMobile, theme, isActive) => ({
        alignItems: "flex-start",
        fontSize: isMobile ? "0.9rem" : "1.15rem",
        fontWeight: isActive ? 600 : 500,
        textAlign: isMobile || isTablet ? "center" : "left",
        minHeight: 48,
        "&.Mui-selected": {
            color: theme.palette.primary.main,
        },
    });

    return (
        <>
            <Grid size={isMobile || isTablet ? 0 : 0.5} />
            <Grid size={isMobile || isTablet ? 12 : 11}>
                <Grid container spacing={0}>
                    {/* 상단 제목 */}
                    <Grid item size={12}>
                        <CenterTitle
                            sx={{
                                mb: isMobile || isTablet ? 4 : 6,
                                fontWeight: 600,
                            }}
                        >
                            동아리 관리
                        </CenterTitle>
                    </Grid>

                    {/* 본문: 왼쪽 탭 + 오른쪽 콘텐츠 */}
                    <Grid
                        item
                        container
                        size={12}
                        mt={0}
                        justifyContent={"center"}
                    >
                        {/* 왼쪽 탭 영역 */}
                        <Grid
                            item
                            size={isMobile || isTablet ? 12 : 2}
                            sx={{
                                display: "flex",
                                justifyContent:
                                    isMobile || isTablet
                                        ? "center"
                                        : "flex-start",
                            }}
                        >
                            <Tabs
                                orientation={
                                    isMobile || isTablet
                                        ? "horizontal"
                                        : "vertical"
                                }
                                variant="scrollable"
                                value={tab}
                                onChange={(e, v) => setTab(v)}
                                sx={{
                                    borderBottom:
                                        isMobile || isTablet ? 1 : "none",
                                    borderColor: "divider",
                                    minWidth:
                                        isMobile || isTablet ? "100%" : 200,
                                    alignItems:
                                        isMobile || isTablet
                                            ? "center"
                                            : "flex-start",
                                    display: "flex",
                                    "& .MuiTabs-indicator": {
                                        left: isMobile || isTablet ? 0 : "auto",
                                        right: 0,
                                        width: 5,
                                        borderRadius: 50,
                                        backgroundColor:
                                            theme.palette.primary.main,
                                    },
                                    "& .MuiTabs-list, & .MuiTabs-flexContainer":
                                        {
                                            justifyContent:
                                                isMobile || isTablet
                                                    ? "center"
                                                    : "flex-start", 
                                            alignItems: "center",
                                        },
                                }}
                            >
                                <Tab
                                    label="가입 요청"
                                    sx={commonTabStyle(
                                        isMobile,
                                        theme,
                                        tab === 0
                                    )}
                                />
                                <Tab
                                    label="회원 관리"
                                    sx={commonTabStyle(
                                        isMobile,
                                        theme,
                                        tab === 1
                                    )}
                                />
                                <Tab
                                    label="모집 게시글 관리"
                                    sx={commonTabStyle(
                                        isMobile,
                                        theme,
                                        tab === 2
                                    )}
                                />
                            </Tabs>
                        </Grid>

                        {/* 오른쪽 콘텐츠 영역 */}
                        <Grid item size={isMobile || isTablet ? 12 : 10}>
                            <Box sx={{ p: isMobile || isTablet ? 3 : 0 }}>
                                {tab === 0 && <CommunityEnrollmentsManage />}
                                {tab === 1 && <CommunityMemberManage />}
                                {tab === 2 && <CommunityPostManage />}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={isMobile || isTablet ? 0 : 0.5} />
        </>
    );
};

export default CommunityManagePage;
