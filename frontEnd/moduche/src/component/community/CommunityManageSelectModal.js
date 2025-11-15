import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Avatar,
    Divider
} from "@mui/material";

const CommunityManageSelectModal = ({ open, onClose, communities, onSelect }) => {

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleDateString("ko-KR");
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>동아리 선택</DialogTitle>

            <DialogContent dividers>
                {communities.map((c, idx) => (
                    <Box
                        key={c.communityId}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            py: 2,
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#fafafa" },
                        }}
                        onClick={() => onSelect(c.communityId)}
                    >
                        {/* 썸네일 */}
                        <Avatar
                            variant="rounded"
                            src={c.representativeImage}
                            sx={{
                                width: 64,
                                height: 64,
                                mr: 2,
                                borderRadius: 2,
                            }}
                        />

                        {/* 정보 */}
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 600 }}>
                                {c.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                개설일: {formatDate(c.createdAt)}
                            </Typography>
                        </Box>

                        {/* 선택 버튼 */}
                        <Button
                            variant="outlined"
                            onClick={(e) => {
                                e.stopPropagation(); // 카드 전체 클릭 방지
                                onSelect(c.communityId);
                            }}
                        >
                            선택
                        </Button>
                    </Box>
                ))}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>닫기</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CommunityManageSelectModal;
