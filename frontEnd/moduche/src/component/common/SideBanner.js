import { useEffect, useState } from "react";
import {
    Paper,
    Box,
    Tooltip,
    IconButton,
    Typography,
    Link,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// 156*258 크기 세로형 배너 (소) => 다른 크기도 필요하신가요? _고은설.
export function SideBannerSmall({ adImage, clickURL, position = "left" }) {
    const [visible, setVisible] = useState(true);
    const [bannerSize, setBannerSize] = useState({
        width: 180,
        height: 320,
        bottom: "5%",
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const footerTrigger =
                document.body.scrollHeight - window.innerHeight - 260;
            setVisible(scrollY < footerTrigger);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleAdClick = () => {
        if (clickURL) {
            window.open(clickURL, "_blank"); // 새 탭으로 열기.
            // window.location.href = clickURL; // 같은 탭으로 이동.
        }
    };

    // 반응형 크기 설정.
    useEffect(() => {
        const updateSize = () => {
            if (isMobile) {
                setBannerSize({ width: 110, height: 180, bottom: "2%" });
            } else {
                const width = window.innerWidth * 0.1;
                const height = width * (16 / 9);
                setBannerSize({ width, height, bottom: "5%" });
            }
        };

        updateSize(); // 최초 계산
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [isMobile]);

    if (isMobile) {
        // return null; 아예 숨긴다면 여기 (과거의 내가 미래의 나에게).
    }

    return (
        <>
            {visible && (
                <Paper
                    elevation={6}
                    onClick={handleAdClick}
                    sx={{
                        position: "fixed",
                        bottom: bannerSize.bottom,
                        ...(position === "left"
                            ? { left: "1%" }
                            : { right: "1%" }),
                        width: bannerSize.width,
                        height: bannerSize.height,
                        borderRadius: 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        zIndex: 1000,
                        backgroundImage: `url(${adImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        "&:hover": { filter: "brightness(1)" },
                    }}
                >
                    {/* 상단 오버레이 */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            backgroundColor: "rgba(0, 0, 0, 0.45)",
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: 600,
                            px: 1,
                            py: 0.3,
                            borderRadius: "8px",
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{ color: "#fff", fontSize: 12 }}
                        >
                            {isMobile ? "광고" : "스폰서 광고"}
                        </Typography>

                        {/* Info 툴팁 */}
                        <Tooltip
                            title={
                                <Box sx={{ p: 0.5 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontSize: 12 }}
                                    >
                                        이곳에 광고를 게재하고 싶으신가요?
                                    </Typography>
                                    <Link
                                        href="https://github.com/kkkddkkk/moduChe"
                                        target="_blank"
                                        underline="hover"
                                        color="#90caf9"
                                        sx={{ fontSize: 12 }}
                                    >
                                        → 광고 문의 바로가기
                                    </Link>
                                </Box>
                            }
                            arrow
                            placement="top"
                        >
                            <IconButton
                                size="small"
                                sx={{
                                    color: "#fff",
                                    "&:hover": { color: "#64b5f6" },
                                    p: 0.2,
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <InfoOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Paper>
            )}
        </>
    );
}

export function HorizontalBanner({ adImage, clickURL }) {
    const handleAdClick = () => {
        if (clickURL) window.open(clickURL, "_blank");
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Paper
            elevation={6}
            sx={{
                position: "relative",
                width: "100%",
                height: 120,
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                mb: 3,
            }}
            onClick={handleAdClick}
        >
            {/* 광고 이미지 (배경 꽉 차게) */}
            <Box
                component="img"
                src={adImage}
                alt="광고 이미지"
                sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                }}
            />

            {/* 좌측 상단 오버레이 */}
            <Box
                sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    backgroundColor: "rgba(0, 0, 0, 0.45)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    px: 1,
                    py: 0.3,
                    borderRadius: "8px",
                }}
            >
                <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ color: "#fff", fontSize: 12 }}
                >
                    {isMobile ? "광고" : "스폰서 광고"}
                </Typography>

                {/* Info 툴팁 */}
                <Tooltip
                    title={
                        <Box sx={{ p: 0.5 }}>
                            <Typography variant="body2" sx={{ fontSize: 12 }}>
                                이곳에 광고를 게재하고 싶으신가요?
                            </Typography>
                            <Link
                                href="https://github.com/kkkddkkk/moduChe"
                                target="_blank"
                                underline="hover"
                                color="#90caf9"
                                sx={{ fontSize: 12 }}
                            >
                                → 광고 문의 바로가기
                            </Link>
                        </Box>
                    }
                    arrow
                    placement="top"
                >
                    <IconButton
                        size="small"
                        sx={{
                            color: "#fff",
                            "&:hover": { color: "#64b5f6" },
                            p: 0.2,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Paper>
    );
}
