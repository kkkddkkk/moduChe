import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import SportsMartialArtsIcon from "@mui/icons-material/SportsMartialArts";

const HomeHeader = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
    return (
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
                mb: 3,
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
                    동아리 둘러보기
                </Typography>
            </Box>

            <Typography
                sx={{
                    opacity: 0.9,
                    fontSize: isMobile ? 15 : isTablet ? 18 : 21,
                    textAlign: "right",
                    whiteSpace: "nowrap",
                    color: "white",
                }}
            >
                함께하는 운동, 즐거운 모임을 찾아보세요
            </Typography>
        </Box>
    );
};

export default HomeHeader;
