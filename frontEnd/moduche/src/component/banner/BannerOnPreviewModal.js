import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    Typography,
    Divider,
    Stack,
    Link,
} from "@mui/material";
import { useState, useEffect } from "react";
import { formatBannerPeriod, getBannerType } from "./utility/bannerUtility";

const BannerOnPreviewModal = ({ data, open, onClose, onDelete }) => {
    const [reason, setReason] = useState("");
    const [isSafeUrl, setIsSafeUrl] = useState(true);

    // 간단한 URL 유해성 체크 (http/https 여부, 도메인 구조 체크).
    useEffect(() => {
        if (!data?.redirectUrl) return;

        try {
            const url = new URL(data.redirectUrl);
            setIsSafeUrl(url.protocol === "https:" || url.protocol === "http:");
        } catch (e) {
            setIsSafeUrl(false);
        }
    }, [data]);

    if (!data) return null;

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = data.imageUrl;
        link.download = data.imageUrl.split("/").pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            sx={{
                "& .MuiPaper-root": {
                    borderRadius: 3,
                    maxHeight: "75vh",
                    display: "flex",
                    flexDirection: "column",

                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 700, textAlign: "center" }}>
                출력 배너 상세 정보
            </DialogTitle>

            <DialogContent dividers>
                {/* --------------------- 이미지 미리보기 영역 --------------------- */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight={700} mb={1}>
                        출력 이미지 미리보기
                    </Typography>

                    <Box
                        component="img"
                        src={data.imageUrl}
                        alt="배너 이미지"
                        sx={{
                            width: "100%",
                            height: "auto",
                            borderRadius: 2,
                            border: "1px solid #ddd",
                            objectFit: "contain",
                        }}
                    />

                    <Button
                        variant="outlined"
                        sx={{ mt: 1 }}
                        onClick={handleDownload}
                    >
                        이미지 다운로드
                    </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* --------------------- 기본 정보 --------------------- */}
                <Typography variant="h6" fontWeight={700} mb={2}>
                    출력 배너 정보
                </Typography>

                <Stack spacing={1.2}>
                    <InfoRow label="배너 고유 번호" value={`BA-${data.id}`} />
                    <InfoRow label="출력 배너 유횽" value={getBannerType(data.bannerTypeLabel)} />
                    <InfoRow label="출력 중요도" value={data.priorityLabel} />
                    <InfoRow
                        label="노출 기간"
                        value={formatBannerPeriod(data.startDate, data.endDate)}
                    />
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* --------------------- 광고 요청자 정보 --------------------- */}
                <Typography variant="h6" fontWeight={700} mb={2}>
                    등록자 정보
                </Typography>

                <Stack spacing={1.2}>
                    <InfoRow label="이름" value={data.ownerName} />
                    <InfoRow label="연락처" value={data.contact} />
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* --------------------- URL 정보 --------------------- */}
                <Typography variant="h6" fontWeight={700} mb={1}>
                    이동 URL
                </Typography>

                <Link
                    href={data.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ fontSize: "0.95rem", wordBreak: "break-all" }}
                >
                    {data.redirectUrl}
                </Link>

                {!isSafeUrl && (
                    <Typography color="error" fontSize="0.9rem" mt={1}>
                        ⚠ URL 형식이 안전하지 않거나 비정상입니다.
                    </Typography>
                )}
            </DialogContent>

            {/* --------------------- 하단 액션 버튼 --------------------- */}
            <DialogActions>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => onDelete(data.id)}
                >
                    내리기
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// 작은 정보 행 컴포넌트
const InfoRow = ({ label, value }) => (
    <Box sx={{ display: "flex", gap: 1 }}>
        <Typography sx={{ fontWeight: 600, width: 120 }}>{label}</Typography>
        <Typography sx={{ flex: 1 }}>{value}</Typography>
    </Box>
);

export default BannerOnPreviewModal;
