import { useEffect, useState } from "react";
import {
    Paper,
    Box,
    Tooltip,
    IconButton,
    Typography,
    Link,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// 156*258 크기 세로형 배너 (소) => 다른 크기도 필요하신가요? _고은설.
export function SideBannerSmall({ adImage, clickURL, position = "left" }) {
    const [visible, setVisible] = useState(true);

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

    return (
        <>
            {visible && (
                <Paper
                    elevation={6}
                    sx={{
                        position: "fixed",
                        bottom: "5%",
                        bottom: "5%",
                        ...(position === "left"
                            ? { left: "1%" }
                            : { right: "1%" }),
                        width: 180,
                        height: 320,
                        borderRadius: 2,
                        p: 1.5,
                        backgroundColor: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(6px)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    {/* 헤더 영역. */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            mb: 1,
                        }}
                    >
                        <Typography variant="subtitle2" fontWeight={600}>
                            스폰서 광고
                        </Typography>

                        {/* Tooltip 아이콘. */}
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
                                        color="#004288"
                                        sx={{ fontSize: 12 }}
                                    >
                                        → 광고 문의 바로가기
                                    </Link>
                                </Box>
                            }
                            arrow
                            placement="top"
                        >
                            <IconButton size="small">
                                <InfoOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* 광고 이미지. */}
                    <Box
                        component="img"
                        src={adImage}
                        alt="광고 이미지"
                        onClick={handleAdClick}
                        sx={{
                            width: "100%",
                            height: "87%",
                            borderRadius: 1.5,
                            objectFit: "cover",
                            objectPosition: "center",
                            cursor: "pointer",
                        }}
                    />
                </Paper>
            )}
        </>
    );
}

export function HorizontalBanner({ adImage, clickURL }) {
    const handleAdClick = () => {
        if (clickURL) window.open(clickURL, "_blank");
    };

    return (
        <Paper
            elevation={6}
            sx={{
                position: "relative", // 자식의 absolute 기준
                width: "100%",
                height: 120,
                borderRadius: 2,
                overflow: "hidden", // 이미지 넘침 방지
                cursor: "pointer",
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
                    objectFit: "cover", // 여백 없이 꽉 채움
                    objectPosition: "center",
                    filter: "brightness(0.9)", // 살짝 어둡게 (텍스트 가독성↑)
                }}
            />

            {/* 좌측 상단 오버레이 */}
            <Box
                sx={{
                    position: "absolute",
                    top: 10,
                    left: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    backgroundColor: "rgba(0, 0, 0, 0.45)",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    px: 1,
                    py: 0.3,
                    borderRadius: "8px",
                }}
            >
                <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ color: "#fff" }}
                >
                    스폰서 광고
                </Typography>

                {/* 정보 아이콘 툴팁 */}
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
                            color: "#90caf9",
                            "&:hover": { color: "#64b5f6" },
                            p: 0.2,
                        }}
                        onClick={(e) => e.stopPropagation()} // 클릭 시 배너 클릭 이벤트 방지
                    >
                        <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Paper>
    );
}
