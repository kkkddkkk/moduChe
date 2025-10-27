import React from "react";
import { Box, Typography } from "@mui/material";

export default function BannersPage() {
    return (
        <Box sx={{ maxWidth: "1280px", mx: "auto" }}>
            <Typography variant="h6" fontWeight={600} mb={1}>
                배너 관리
            </Typography>
            <Typography variant="body2" color="text.secondary">
                배너 이미지 업로드 / 노출 순서 / 활성/비활성 토글 자리
            </Typography>
        </Box>
    );
}
