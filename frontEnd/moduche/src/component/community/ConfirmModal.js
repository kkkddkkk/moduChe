import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    Box,
    Divider,
} from "@mui/material";
import { OneAlignedButton } from "../common/Button";

const ConfirmModal = ({
    open,
    title,
    content,
    onConfirm,
    onClose,
    isOneBtn = false,
    isNoEscape = false,
}) => {
    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                console.log(reason);
                if (
                    (reason === "backdropClick" ||
                        reason === "escapeKeyDown") &&
                    isNoEscape === true
                )
                    return;
                onClose();
            }}
            maxWidth="xs"
            fullWidth
        >
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
            <Divider sx={{ color: "grey" }} />
            <DialogActions
                sx={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "space-between",
                    px: 4,
                    py: 2,
                    justifySelf: "center",
                }}
            >
                <Box
                    display={"flex"}
                    flexDirection={"row"}
                    flex={1}
                    justifyContent={"space-between"}
                >
                    {!isOneBtn && (
                        <OneAlignedButton
                            variant="outlined"
                            onClick={onClose}
                            sx={{ width: "90%" }}
                            buttonWrapperSx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            취소
                        </OneAlignedButton>
                    )}

                    <OneAlignedButton
                        variant="contained"
                        color="primary"
                        onClick={onConfirm}
                        inline={false}
                        align="flex-end"
                        autoFocus
                        sx={{ width: "90%" }}
                        buttonWrapperSx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        확인
                    </OneAlignedButton>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal;
