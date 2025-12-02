import {
    Modal,
    Box,
    Typography,
    IconButton,
    Divider,
    Paper,
    Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function GuestBannerListModal({ open, onClose, results }) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90%",
                    maxWidth: 480,
                    maxHeight: "60vh", // 🔥 요구사항: 화면 60%
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    boxShadow: 24,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* 헤더 */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, ml: 1 }}
                    >
                        내 신청 내역
                    </Typography>

                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {/* 스크롤 영역 */}
                <Box
                    sx={{
                        overflowY: "auto",
                        flexGrow: 1,
                        pr: 1,
                    }}
                >
                    {/* 목록 렌더링 */}
                    {results.length === 0 ? (
                        <Typography
                            textAlign="center"
                            sx={{ mt: 4, color: "text.secondary" }}
                        >
                            조회된 신청 내역이 없습니다.
                        </Typography>
                    ) : (
                        results.map((item) => (
                            <Paper
                                key={item.id}
                                elevation={2}
                                sx={{
                                    p: 1.5,
                                    mb: 1.5,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    borderRadius: 2,
                                    cursor: "pointer",
                                    "&:hover": {
                                        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                                    },
                                }}
                            >
                                {/* 좌측 썸네일 1:1 */}
                                <Box
                                    component="img"
                                    src={item.imageUrl}
                                    alt="banner"
                                    sx={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: 1.5,
                                        objectFit: "cover",
                                        flexShrink: 0,
                                    }}
                                />

                                {/* 우측 정보 */}
                                <Stack spacing={0.5}>
                                    <Typography
                                        fontSize="0.95rem"
                                        fontWeight={600}
                                    >
                                        {item.status === "APPLIED"
                                            ? "심사 대기"
                                            : item.status === "APPROVED"
                                            ? "승인됨"
                                            : item.status === "REJECTED"
                                            ? "거절됨"
                                            : item.status}
                                    </Typography>

                                    <Typography
                                        fontSize="0.8rem"
                                        color="text.secondary"
                                    >
                                        신청일자:{" "}
                                        {item.createdAt?.slice(0, 10)}
                                    </Typography>
                                </Stack>
                            </Paper>
                        ))
                    )}
                </Box>
            </Box>
        </Modal>
    );
}
