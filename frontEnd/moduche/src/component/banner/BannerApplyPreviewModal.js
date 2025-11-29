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
import { getBannerType } from "./utility/bannerUtility";

const BannerApplyPreviewModal = ({ data, open, onClose, OnApprove, OnDecline }) => {
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
                배너 신청 상세 정보
            </DialogTitle>

            <DialogContent dividers>
                {/* --------------------- 이미지 미리보기 영역 --------------------- */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight={700} mb={1}>
                        신청 이미지 미리보기
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
                    배너 신청 정보
                </Typography>

                <Stack spacing={1.2}>
                    <InfoRow label="신청 고유 번호" value={`BA-APP-${data.id}`} />
                    <InfoRow label="신청 배너 유형 " value={getBannerType(data.bannerTypeLabel)} />
                    <InfoRow label="신청 중요도" value={data.priorityLabel} />
                    <InfoRow
                        label="신청 노출 기간"
                        value={`${data.durationDays}일`}
                    />
                    <InfoRow label="신청 상태" value={data.status === "APPLIED" ? "처리 대기" : "처리 완료"} />
                    <InfoRow
                        label="신청일"
                        value={new Date(data.appliedAt).toLocaleString()}
                    />
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* --------------------- 광고 요청자 정보 --------------------- */}
                <Typography variant="h6" fontWeight={700} mb={2}>
                    신청자 정보
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
                <Button variant="contained" color="success" onClick={() =>OnApprove(data.id)}>
                    승인
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={() => OnDecline(reason)}
                >
                    거절
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

export default BannerApplyPreviewModal;
