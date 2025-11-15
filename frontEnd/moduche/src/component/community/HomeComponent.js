import {
    Box,
    Grid,
    Paper,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {
    CenterTitle,
    Contents100,
    SmallerSubTitle,
    SubTitle,
} from "../common/Text";
import { OneAlignedButton, TwoAlignedButtons } from "../common/Button";
import PostAreaComponent from "./PostAreaComponent";
import { useEffect, useState } from "react";
import { SideBannerSmall } from "../common/SideBanner";
import QuickSearchBar from "../../pages/Course/QuickSearchBar";
import HomeHeader from "./HomeHeader";
import { getIdRoleFromToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import {
    checkIfMember,
    checkIfOwner,
} from "../../api/communityAPI/communityAPI";

const HomeComponent = ({ posts, totalPages, page, setPage }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const [userRole, setUserRole] = useState("");

    //기관 화원인지 확인, 기관 회원인 경우 소유한 동아리가 있는지 확인.
    const [isOwner, setIsOwner] = useState(false);

    //개인 회원인지 확인, 개인 회원인 경우 소속된 동아리가 있는지 확인.
    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        // 역할(Role) 확인.
        const role = getIdRoleFromToken(token)?.role;
        setUserRole(role);

        if (role === "FACILITY") {
            checkIfOwner().then((result) => {
                setIsOwner(result);
            });
        }

        if (role === "INDIVIDUAL") {
            checkIfMember().then((result) => {
                setIsMember(result);
            });
        }
    }, []);

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
            <Grid
                size={12}
                sx={{ mb: userRole === "INDIVIDUAL" && !isMember ? 3 : 0 }}
            >
                <HomeHeader />
            </Grid>

            {userRole === "FACILITY" && (
                <Grid
                    container
                    justifyContent={isMobile ? "center" : "flex-end"}
                    size={12}
                    sx={{ mt: 1, mb: 1 }}
                >
                    {isOwner && (
                        <>
                            <Grid item size={isMobile ? 6 : isTablet ? 3 : 2}>
                                <OneAlignedButton
                                    sx={{ height: "100%", width: "100%" }}
                                    buttonWrapperSx={{ width: "90%" }}
                                    onClick={() =>
                                        navigate("/community/manage")
                                    }
                                >
                                    {isMobile || isTablet
                                        ? "동아리 관리"
                                        : "내 동아리 관리하기"}
                                </OneAlignedButton>
                            </Grid>
                            <Grid item size={isMobile ? 6 : isTablet ? 3 : 2}>
                                <OneAlignedButton
                                    sx={{ height: "100%", width: "100%" }}
                                    buttonWrapperSx={{ width: "90%" }}
                                    onClick={() =>
                                        navigate("/community/register")
                                    }
                                >
                                    {isMobile || isTablet
                                        ? "동아리 등록"
                                        : "새 동아리 등록하기"}
                                </OneAlignedButton>
                            </Grid>
                        </>
                    )}
                </Grid>
            )}

            {userRole === "INDIVIDUAL" && isMember && (
                <Grid
                    container
                    justifyContent={isMobile ? "center" : "flex-end"}
                    size={12}
                    sx={{ mt: 1, mb: 1 }}
                >
                    <Grid item size={isMobile ? 6 : isTablet ? 3 : 2}>
                        <OneAlignedButton
                            sx={{ height: "100%", width: "100%" }}
                            buttonWrapperSx={{ width: "90%" }}
                            onClick={() => navigate("/community/member-manage")}
                        >
                            {isMobile || isTablet
                                ? "동아리 관리"
                                : "내 동아리 관리하기"}
                        </OneAlignedButton>
                    </Grid>
                </Grid>
            )}

            <Grid size={12} sx={{ m: 2, mt: 0, mb: 3 }}>
                <QuickSearchBar />
            </Grid>

            <Grid size={sideSize} />
            <Grid size={centerSize}>
                {!posts || posts.length === 0 ? (
                    <SubTitle
                        sx={{
                            color: "text.secondary",
                            textAlign: "center",
                            mt: 6,
                        }}
                        children={"아직 등록된 동아리 모집 공고가 없습니다!"}
                    />
                ) : (
                    <PostAreaComponent
                        posts={posts}
                        totalPages={totalPages}
                        page={page}
                        setPage={setPage}
                    />
                )}
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
