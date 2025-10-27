import React from "react";
import { Box, Typography } from "@mui/material";

export default function CalculatePage() {
    return (
        <Box sx={{ maxWidth: "1280px", mx: "auto" }}>
            <Typography variant="h6" fontWeight={600} mb={1}>
                정산 내역 게시판
            </Typography>
            <Typography variant="body2" color="text.secondary">
                정산 금액 / 기간 / 상태 / 다운로드 자리
            </Typography>
        </Box>
    );
}
