import { useEffect, useState } from "react";
import { SideBannerSmall, HorizontalBanner } from "../common/SideBanner";
import {
    fetchHeaderBanner,
    fetchSideBanner,
} from "../../api/bannerAPI/bannerAPI";
import { Box } from "@mui/material";

export default function BannerLayout({
    children,
    useHeader = false, // 상단 배너 사용 여부
    useSide = false, // 사이드 배너 사용 여부
    sidePosition = "right", // left / right
}) {
    const [headerBanner, setHeaderBanner] = useState(null);
    const [sideBanner, setSideBanner] = useState(null);

    // 필요한 배너만 요청
    useEffect(() => {
        (async () => {
            if (useHeader) {
                const header = await fetchHeaderBanner();
                setHeaderBanner(header);
            }

            if (useSide) {
                const side = await fetchSideBanner();
                setSideBanner(side);
            }
        })();
    }, [useHeader, useSide]);

    return (
        <>
            {/* 상단 광고 */}
            {useHeader && headerBanner && (
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        mt: 2,
                    }}
                >
                    <HorizontalBanner
                        adImage={headerBanner.imageUrl}
                        clickURL={headerBanner.redirectUrl}
                    />
                </Box>
            )}

            {/* 실제 페이지 */}
            {children}

            {/* 사이드 광고 */}
            {useSide && sideBanner && (
                <SideBannerSmall
                    adImage={sideBanner.imageUrl}
                    clickURL={sideBanner.redirectUrl}
                    position={sidePosition}
                />
            )}
        </>
    );
}
