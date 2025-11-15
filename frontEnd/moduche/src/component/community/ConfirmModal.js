import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

const ConfirmModal = ({ open, title, content, onConfirm, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 600, textAlign: "center" }}>
                {title || "알림"}
            </DialogTitle>
            <DialogContent>
                <Typography
                    sx={{
                        textAlign: "center",
                        mt: 1,
                        mb: 1.5,
                        whiteSpace: "pre-line",
                    }}
                >
                    {content || "내용이 없습니다."}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button variant="outlined" onClick={onClose}>
                    취소
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onConfirm}
                    autoFocus
                >
                    확인
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal;
