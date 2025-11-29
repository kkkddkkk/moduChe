import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { OneAlignedButton } from "../common/Button";
import { useEffect, useState } from "react";
import { getIdRoleFromToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import {
    checkIfMember,
    checkIfOwner,
} from "../../api/communityAPI/communityAPI";
import SportsMartialArtsIcon from "@mui/icons-material/SportsMartialArts";

const CommunityHomeHeader = () => {
    const [userRole, setUserRole] = useState("");

    //기관 화원인지 확인, 기관 회원인 경우 소유한 동아리가 있는지 확인.
    const [isOwner, setIsOwner] = useState(false);

    //개인 회원인지 확인, 개인 회원인 경우 소속된 동아리가 있는지 확인.
    const [isMember, setIsMember] = useState(false);

    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
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

    return (
        <>
            <Grid size={12} sx={{ mb: 5, backgroundColor: "inherit" }}>
                <Box
                    sx={{
                        width: "99.5%",
                        mx: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: isMobile ? 2 : 3,
                        px: isMobile ? 2 : isTablet ? 4 : 8,
                        backgroundColor: "#004288",
                        color: "white",

                        boxShadow:
                            "0 0 10px 2px rgba(11, 36, 71, 0.5), 0 0 10px 2px rgba(11, 36, 71, 0.5)",
                        borderBottomLeftRadius: 35,
                        borderBottomRightRadius: 35,
                        position: "relative",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <SportsMartialArtsIcon
                            sx={{
                                fontSize: isMobile ? 34 : isTablet ? 42 : 48,
                                color: "#FFD95A",
                                flexShrink: 0,
                            }}
                        />
                        <Typography
                            variant={isMobile ? "h7" : isTablet ? "h6" : "h4"}
                            fontWeight={500}
                            sx={{
                                letterSpacing: "-0.5px",
                                color: "white",
                            }}
                        >
                            {"동아리 둘러보기"}
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            opacity: 0.9,
                            fontSize: isMobile ? 12 : isTablet ? 18 : 21,
                            textAlign: "right",
                            whiteSpace: "nowrap",
                            color: "white",
                        }}
                    >
                        {isMobile
                            ? "함께하는 즐거운 운동"
                            : "함께하는 운동, 즐거운 모임을 찾아보세요"}
                    </Typography>

                    {userRole === "FACILITY" && (
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: -15,
                                right: isMobile ? "50%" : "4%",
                                transform: isMobile
                                    ? "translateX(50%)"
                                    : "none",
                                display: "flex",
                                gap: 2,
                                zIndex: 5,
                            }}
                        >
                            {isOwner && (
                                <OneAlignedButton
                                    onClick={() =>
                                        navigate("/community/manage")
                                    }
                                    sx={{
                                        height: 38,
                                        whiteSpace: "nowrap",
                                        zIndex: 1000,
                                        backgroundColor: "#1363b9",
                                        fontWeight: 400,
                                        borderRadius: "55px",
                                    }}
                                    color="secondary"
                                >
                                    {isMobile || isTablet
                                        ? "동아리 관리"
                                        : "내 동아리 관리하기"}
                                </OneAlignedButton>
                            )}

                            <OneAlignedButton
                                onClick={() => navigate("/community/register")}
                                sx={{
                                        height: 38,
                                        whiteSpace: "nowrap",
                                        zIndex: 1000,
                                        backgroundColor: "#1363b9",
                                        fontWeight: 400,
                                        borderRadius: "55px",
                                }}
                                color="secondary"
                            >
                                {isMobile || isTablet
                                    ? "동아리 등록"
                                    : "새 동아리 등록하기"}
                            </OneAlignedButton>
                        </Box>
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
                                    sx={{
                                        height: 38,
                                        whiteSpace: "nowrap",
                                        zIndex: 1000,
                                        backgroundColor: "#1363b9",
                                        fontWeight: 400,
                                        borderRadius: "55px",
                                    }}
                                    color="secondary"
                                    buttonWrapperSx={{ width: "90%" }}
                                    onClick={() =>
                                        navigate("/community/member-manage")
                                    }
                                >
                                    {isMobile || isTablet
                                        ? "동아리 관리"
                                        : "내 동아리 관리하기"}
                                </OneAlignedButton>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Grid>
        </>
    );
};
export default CommunityHomeHeader;
